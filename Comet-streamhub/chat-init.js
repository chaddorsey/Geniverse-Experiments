var hub = new StreamHub();
hub.connect("http://localhost:7878/");
hub.subscribe("chat", chatUpdated);
