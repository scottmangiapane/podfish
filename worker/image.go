package main

import (
	"errors"
	"fmt"
	"image"
	"image/color"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"net/http"
	"time"

	"github.com/disintegration/imaging"
	_ "golang.org/x/image/webp"
)

const (
	maxImageSize = 10 * 1024 * 1024 // 10 MB
	maxSizeSm    = 140
	maxSizeMd    = 300
	maxSizeLg    = 560
)

func SanitizeAndSaveImage(imageURL, outputBasePath string) (color.Color, error) {
	client := &http.Client{Timeout: 10 * time.Second}

	resp, err := client.Get(imageURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch image: %w", err)
	}
	defer resp.Body.Close()

	if resp.ContentLength > maxImageSize {
		return nil, errors.New("image too large")
	}

	limitedReader := io.LimitReader(resp.Body, maxImageSize)

	img, format, err := image.Decode(limitedReader)
	if err != nil {
		return nil, fmt.Errorf("failed to decode image: %w", err)
	}

	switch format {
	case "jpeg", "gif", "png", "webp":
	default:
		return nil, fmt.Errorf("unsupported image format: %s", format)
	}

	sizes := []struct {
		size       int
		outputPath string
	}{
		{maxSizeSm, fmt.Sprintf("%s-sm.jpeg", outputBasePath)},
		{maxSizeMd, fmt.Sprintf("%s-md.jpeg", outputBasePath)},
		{maxSizeLg, fmt.Sprintf("%s-lg.jpeg", outputBasePath)},
	}

	for _, size := range sizes {
		resized := imaging.Fit(imaging.Clone(img), size.size, size.size, imaging.Lanczos)

		if err := imaging.Save(resized, size.outputPath, imaging.JPEGQuality(85)); err != nil {
			return nil, fmt.Errorf("failed to save cover at %dx%d: %w", size.size, size.size, err)
		}
	}

	return AverageColor(img), nil
}
