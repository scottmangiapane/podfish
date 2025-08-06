package shared

import (
	"fmt"
	"net/http"
)

func SetupHealth() {
	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	go func() {
		port := ":8080"
		fmt.Printf("Health check registered on %s\n", port)
		if err := http.ListenAndServe(port, nil); err != nil {
			panic(err)
		}
	}()
}
