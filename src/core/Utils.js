class DateUpdate extends Date {
  addHoursToNow = (hrs) =>
    new Date(this.getTime() + hrs * (60 * 60 * 1000));
}

module.exports = {
  DateUpdate,
};
