package global

import (
	"encoding/xml"
	"fmt"
	"os"
	"podfish/models"
	"strings"
	"time"
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
	Url    string `xml:"url"`
	UrlAlt string `xml:"href,attr"`
}

type Item struct {
	ID          string `xml:"guid"`
	Title       string `xml:"title"`
	Description string `xml:"description"`
	Date        string `xml:"pubDate"`
}

func Sync(p *models.Podcast) error {
	res, err := Fetch(p.RSS)
	if err != nil {
		fmt.Printf("Failed to fetch RSS for podcast %s\n", p.ID)
		return err
	}

	var rss Rss
	if err := xml.Unmarshal(res, &rss); err != nil {
		fmt.Printf("Failed to parse RSS for podcast %s\n", p.ID)
		return err
	}

	image := strings.TrimSpace(rss.Channel.Image.Url)
	if image == "" {
		image = strings.TrimSpace(rss.Channel.Image.UrlAlt)
	}

	res, err = Fetch(image)
	if err != nil {
		fmt.Printf("Failed to fetch image for podcast %s\n", p.ID)
		fmt.Println(err)
		return err
	}

	path := fmt.Sprintf("%s/%s", os.Getenv("RSS_DATA_DIR"), p.ImageID)
	err = os.WriteFile(path, res, 0644)
	if err != nil {
		fmt.Printf("Failed to write image %s\n", p.ImageID)
		fmt.Println(err)
		return err
	}

	p.Title = strings.TrimSpace(rss.Channel.Title)
	p.Description = strings.TrimSpace(rss.Channel.Description)

	result := DB.Save(p)
	if result.Error != nil {
		fmt.Printf("Failed to save podcast for RSS feed %s\n", p.RSS)
		fmt.Println(result.Error)
		return result.Error
	}

	for _, item := range rss.Channel.Items {
		date, err := time.Parse("Mon, _2 Jan 2006 15:04:05 MST", item.Date)
		if err != nil {
			fmt.Printf("Failed to parse timestamp %s\n", item.Date)
			fmt.Println(err)
			continue
		}

		var episode models.Episode
		result := DB.FirstOrCreate(&episode, models.Episode{
			PodcastID:   p.ID,
			Title:       item.Title,
			Description: item.Description,
			Date:        date,

			// TODO episode ID
			// TODO add constraint on episode ID and podcast ID
		})
		if result.Error != nil {
			fmt.Printf("Failed to create episode %s for podcast %s\n", item.ID, p.ID)
			fmt.Println(result.Error)
			continue
		}
	}

	return nil
}
