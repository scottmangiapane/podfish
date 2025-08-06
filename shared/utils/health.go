package utils

import (
	"log"
	"net/http"
)

func SetupHealth() {
	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	go func() {
		port := ":8080"
		log.Printf("Health check registered on port %v", port)
		if err := http.ListenAndServe(port, nil); err != nil {
			panic(err)
		}
	}()
}
