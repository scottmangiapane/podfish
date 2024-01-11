package global

import (
	"io"
	"net/http"
)

func Fetch(url string) ([]byte, error) {
	res, err := http.Get(url)

	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}
