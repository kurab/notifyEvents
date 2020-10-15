function notifyEvents() {
  const calendarId = '{Your Calendar ID}';
  const calendar = CalendarApp.getCalendarById(calendarId);
  const calendarName = calendar.getName();

  const today = new Date();
  const dayOfWeek = today.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return;

  const calendarEvents = calendar.getEventsForDay(today);

  var message = 'Good morning!\nNotification from ' + calendarName + ' at '
                 Utilities.formatDate(today, 'GMT+0900', 'MM/dd') +
                '\n-----------------------------------------';

  if (calendarEvents.length) {
    for (var event of calendarEvents) {
      var eventTitle = event.getTitle() ? event.getTitle() : '(no title)';
      message = message + '\n- ' + eventTitle;
      if (!event.isAllDayEvent()) {
        message = message + ' at '+
                  Utilities.formatDate(event.getStartTime(), 'GMT+0900', 'HH:mm') + '~' +
                  Utilities.formatDate(event.getEndTime(), 'GMT+0900', 'HH:mm') + '(JST)';
      }
    }
  } else {
    message = message + '\nThere is no event, today. Good day!^^';
  }

  postToChat(message);
  postToChatwork(message);
  postToLine(message);
}

function postToChat(message) {
  const chatWebhook = '{Your Google Chat Room Webhook Url}';
  const messageText = { 'text': message };
  const options = {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    'payload': JSON.stringify(messageText)
  };
  var result = UrlFetchApp.fetch(chatWebhook, options);
  Logger.log(result);
}

function postToChatwork(message) {
  const chatworkToken = '{Your Chatwork API Token}';
  const chatworkRoomId = '{Your Chatwork Chat Room ID(Number)}';
  const chatworkClient = ChatWorkClient.factory({token: chatworkToken});
  chatworkClient.sendMessage({room_id: chatworkRoomId, body: message});
}

function postToLine(message) {
  const lineToken = '{Your LINE Messaging API Access Token}';
  const lineMessagePushUrl = 'https://api.line.me/v2/bot/message/push';
  const lineHeaders = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": "Bearer " + lineToken
  };
  const payload = {
    "to" : "{Your LINE USER ID(Not Your LINE ID)}",
    "messages" : [{
      "type": "text",
      "text": message
    }]
  };
  const options = {
    "method": "POST",
    "headers": lineHeaders,
    "payload": JSON.stringify(payload)
  };
  var result = UrlFetchApp.fetch(lineMessagePushUrl, options);
  Logger.log(result);
}
