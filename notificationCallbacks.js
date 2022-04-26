import Pushe from 'pushe-react-native';

module.exports = async notificationData => {
  if (notificationData.EVENT_TYPE === Pushe.EVENTS.RECEIVED) {
    // Notification received
    console.log('BG notification received', notificationData);
  } else if (notificationData.EVENT_TYPE === Pushe.EVENTS.CLICKED) {
    // Notification clicked
    console.log('BG notification clicked', notificationData);
  } else if (notificationData.EVENT_TYPE === Pushe.EVENTS.DISMISSED) {
    // Notification dismissed
    console.log('BG notification dismissed', notificationData);
  } else if (notificationData.EVENT_TYPE === Pushe.EVENTS.BUTTON_CLICKED) {
    // Notification Button clicked
    console.log('BG notification button clicked', notificationData);
  } else if (
    notificationData.EVENT_TYPE === Pushe.EVENTS.CUSTOM_CONTENT_RECEIVED
  ) {
    // Custom Content Received
    console.log('BG notification custom content', notificationData);
  }
};
