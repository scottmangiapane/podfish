package global

import (
	"errors"
	"fmt"
	"image"
	"io"
	"net/http"
	"time"

	"github.com/disintegration/imaging"

	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"

	_ "golang.org/x/image/webp"
)

const (
	maxImageSize = 10 * 1024 * 1024 // 10 MB
	maxWidth     = 500
	maxHeight    = 500
)

func SanitizeAndSaveImage(imageURL, outputPath string) error {
	client := &http.Client{Timeout: 10 * time.Second}

	resp, err := client.Get(imageURL)
	if err != nil {
		return fmt.Errorf("failed to fetch image: %w", err)
	}
	defer resp.Body.Close()

	if resp.ContentLength > maxImageSize {
		return errors.New("image too large")
	}

	limitedReader := io.LimitReader(resp.Body, maxImageSize)

	img, format, err := image.Decode(limitedReader)
	if err != nil {
		return fmt.Errorf("failed to decode image: %w", err)
	}

	switch format {
	case "jpeg", "gif", "png", "webp":
	default:
		return fmt.Errorf("unsupported image format: %s", format)
	}

	resized := imaging.Fit(imaging.Clone(img), maxWidth, maxHeight, imaging.Lanczos)

	err = imaging.Save(resized, outputPath, imaging.JPEGQuality(85))
	if err != nil {
		return fmt.Errorf("failed to save jpeg: %w", err)
	}

	return nil
}
