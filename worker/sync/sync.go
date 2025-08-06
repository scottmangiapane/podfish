package sync

import (
	"encoding/xml"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/scottmangiapane/podfish/shared"
	"github.com/scottmangiapane/podfish/shared/models"
	"gorm.io/gorm/clause"
)

type Rss struct {
	Channel Channel `xml:"channel"`
}

type Channel struct {
	Image       Image  `xml:"image"`
	Title       string `xml:"title"`
	Description string `xml:"description"`
	Items       []Item `xml:"item"`
}

type Image struct {
	URL    string `xml:"url"`
	AltURL string `xml:"href,attr"`
}

type Item struct {
	ID          string      `xml:"guid"`
	Title       string      `xml:"title"`
	Description string      `xml:"description"`
	Duration    string      `xml:"duration"`
	Date        string      `xml:"pubDate"`
	Enclosures  []Enclosure `xml:"enclosure"`
}

type Enclosure struct {
	URL  string `xml:"url,attr"`
	Type string `xml:"type,attr"`
}

func Sync(podcastId uuid.UUID) error {
	var podcast models.Podcast
	result := shared.DB.First(&podcast, models.Podcast{
		PodcastID: podcastId,
	})
	if result.Error != nil {
		log.Printf("Error getting podcast from DB: %v", result.Error)
		return result.Error
	}

	podcast.LastSyncAttemptAt = time.Now()
	result = shared.DB.Save(podcast)
	if result.Error != nil {
		log.Printf("Error saving podcast sync attempt in DB: %v", result.Error)
		return result.Error
	}

	res, err := Fetch(podcast.RSS)
	if err != nil {
		log.Printf("Error fetching RSS: %v", err)
		return err
	}

	var rss Rss
	if err := xml.Unmarshal(res, &rss); err != nil {
		log.Printf("Error parsing RSS: %v", err)
		return err
	}

	podcast.Title = strings.TrimSpace(rss.Channel.Title)
	podcast.Description = strings.TrimSpace(rss.Channel.Description)

	imageURL := strings.TrimSpace(rss.Channel.Image.URL)
	if imageURL == "" {
		imageURL = strings.TrimSpace(rss.Channel.Image.AltURL)
	}

	outputPathBase := fmt.Sprintf("%s/%s", os.Getenv("RSS_DATA_DIR"), podcast.ImageID)
	color, err := SanitizeAndSaveImage(imageURL, outputPathBase)
	if err != nil {
		log.Printf("Error writing image %v: %v", podcast.ImageID, err)
		return err
	}
	podcast.Color = ColorToHexString(color)

	podcast.LastSyncAt = podcast.LastSyncAttemptAt
	result = shared.DB.Save(podcast)
	if result.Error != nil {
		log.Printf("Error saving podcast in DB: %v", result.Error)
		return result.Error
	}

	var episodes []models.Episode
	for _, item := range rss.Channel.Items {
		date, err := parseDate(item.Date)
		if err != nil {
			log.Printf("Error parsing date '%v': %v", item.Date, err)
		}

		duration, err := parseDuration(item.Duration)
		if err != nil {
			log.Printf("Error parsing duration '%v': %v", item.Duration, err)
		}

		var url string
		for _, enclosure := range item.Enclosures {
			if enclosure.Type == "audio/mpeg" {
				url = enclosure.URL
				break
			}
		}

		episodes = append(episodes, models.Episode{
			PodcastID:   podcast.PodcastID,
			ItemID:      item.ID,
			Title:       item.Title,
			Description: item.Description,
			Date:        date,
			Duration:    duration,
			URL:         url,
		})
	}

	// TODO this causes a lot of log spam, and will break if the query is >1GB
	result = shared.DB.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "podcast_id"}, {Name: "item_id"}},
		DoUpdates: clause.AssignmentColumns([]string{"title", "description", "date", "duration", "url"}),
	}).Create(&episodes)
	if result.Error != nil {
		log.Printf("Error bulk upserting episodes in DB: %v", result.Error)
	}

	return nil
}

func parseDate(input string) (time.Time, error) {
	layouts := []string{
		"Mon, _2 Jan 2006 15:04:05 MST",
		"Mon, _2 Jan 2006 15:04:05 -0700",
	}
	err := fmt.Errorf("invalid date format '%s'", input)

	for _, layout := range layouts {
		t, err := time.Parse(layout, input)
		if err == nil {
			return t, nil
		}
	}
	return time.Time{}, err
}

func parseDuration(input string) (uint, error) {
	parts := strings.Split(input, ":")
	hours := 0
	minutes := 0
	err := fmt.Errorf("invalid duration format '%s'", input)

	switch len(parts) {
	case 3:
		h, e := strconv.Atoi(parts[len(parts)-3])
		if e != nil {
			return 0, err
		}
		hours = h
		fallthrough
	case 2:
		m, e := strconv.Atoi(parts[len(parts)-2])
		if e != nil {
			return 0, err
		}
		minutes = m
		fallthrough
	case 1:
		seconds, e := strconv.Atoi(parts[len(parts)-1])
		if e != nil {
			return 0, err
		}
		return uint(hours*3600 + minutes*60 + seconds), nil
	}
	return 0, err
}
