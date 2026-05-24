// Email service disabled by user request
module.exports = {
  sendTransactionNotificationEmail: async () => {
    // console.log('Email notification skipped (service disabled)');
    return true;
  },
  sendRegistrationEmail: async () => {
    return true;
  }
};