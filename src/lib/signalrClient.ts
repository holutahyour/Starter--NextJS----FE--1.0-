import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel
} from "@microsoft/signalr";

let connection: HubConnection | null = null;

export const startSignalRConnection = async (): Promise<HubConnection> => {
  if (!connection) {
    connection = new HubConnectionBuilder()
      .withUrl("educ8e-connector-app.azurewebsites.net/hubs/notification") 
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.onreconnecting((error) => {
      console.warn("Reconnecting...", error);
    });

    connection.onreconnected(() => {
      console.log("Reconnected!");
    });

    connection.onclose((error) => {
      console.error("Connection closed.", error);
    });

    try {
      await connection.start();
      console.log("SignalR connected.");
    } catch (error) {
      console.error("SignalR connection error:", error);
    }
  }

  return connection;
};
