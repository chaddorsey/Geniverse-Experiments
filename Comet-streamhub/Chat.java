import java.io.File;
import com.streamhub.api.PushServer;
import com.streamhub.nio.NIOServer;
import com.streamhub.api.Client;
import com.streamhub.api.PublishListener;
import com.streamhub.api.JsonPayload;
import com.streamhub.api.Payload;

public class Chat implements PublishListener {
private PushServer server;

public static void main(String[] args) throws Exception {
  new Chat();
}

public Chat() throws Exception {
  server = new NIOServer(7878);
  server.addStaticContent(new File("."));
  server.start();
  server.getSubscriptionManager().addPublishListener(this);
  System.out.println("Comet server started at http://localhost:7878/!");
  System.out.println("Press any key to stop...");
  System.in.read();
  server.stop();
}

public void onMessageReceived(Client client, String topic, Payload payload) {
  Payload chatMessage = new JsonPayload(topic);
  chatMessage.addField("client", "Client-" + client.getUid());
  chatMessage.addField("message", payload.getFields().get("message"));
  chatMessage.addField("organism", payload.getFields().get("organism"));
  server.publish(topic, chatMessage);
}
}