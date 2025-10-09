package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

const port = ":8080"

func main() {
	http.HandleFunc("/api/sim/launch", handleLaunch)

	fmt.Println("Started server on port", port)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		fmt.Printf("error starting server: %s\n", err)
		os.Exit(1)
	}
}

func handleLaunch(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	fmt.Println("Got message from front")

	var payload map[string]any
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}
	fmt.Printf("Received JSON: %+v\n", payload)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok", "msg": "Simulation started"})
}
