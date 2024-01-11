package global

import (
	"encoding/xml"
	"fmt"
	"os"
	"podfish/models"
	"strings"
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

func Sync(p models.Podcast) {
	res, err := Fetch(p.RSS)
	if err != nil {
		fmt.Printf("Failed to fetch RSS for podcast %s\n", p.ID)
		return
	}

	var rss Rss
	if err := xml.Unmarshal(res, &rss); err != nil {
		fmt.Printf("Failed to parse RSS for podcast %s\n", p.ID)
		return
	}

	image := strings.TrimSpace(rss.Channel.Image.Url)
	if image == "" {
		image = strings.TrimSpace(rss.Channel.Image.UrlAlt)
	}

	res, err = Fetch(image)
	if err != nil {
		fmt.Printf("Failed to fetch image for podcast %s\n%v\n", p.ID, err)
	} else {
		path := fmt.Sprintf("./rss_data/%s", p.ImageID)
		err = os.WriteFile(path, res, 0644)
		if err != nil {
			fmt.Printf("Failed to write image %s\n", p.ImageID)
			fmt.Println(err)
		}
	}

	p.Title = strings.TrimSpace(rss.Channel.Title)
	p.Description = strings.TrimSpace(rss.Channel.Description)

	DB.Save(&p)

	for _, item := range rss.Channel.Items {
		var episode models.Episode
		result := DB.FirstOrCreate(&episode, models.Episode{
			PodcastID:   p.ID,
			Title:       item.Title,
			Description: item.Description,
			// TODO date
			// TODO episode ID
			// TODO add constraint on episode ID and podcast ID
		})
		if result.Error != nil {
			fmt.Printf("Failed to create episode %s for podcast\n", item.ID, p.ID)
			fmt.Println(result.Error)
			return
		}
	}
}
