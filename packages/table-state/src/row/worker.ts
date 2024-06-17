
self.onmessage = ($event: MessageEvent) => {
  const data = $event.data;

  console.log(data);


  self.close();
}