export default class Shill {
  constructor(props) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.author = props.author;
    this.amount = props.amount;
    this.hours = props.hours;
    this.link = props.link;
    this.linkText = props.linktext;
    this.image = props.image.split(',');
    this.likes = props.likes;
    this.readers = props.readers;
    this.shortname = props.shortname;
    this.tags = props.tags.split(',');
    this.props = JSON.parse(props.props);
    this.artList = this.props.art ? this.props.art : [];
  }

  static toInstanceList(shillList) {
    return shillList.map((el) => new Shill(el));
  }

  timeString() {
    let localTime = this.hours * 6; // Let's assume people put 4 hours into a long shill a day at most
    if (localTime > 1437) return `${Math.trunc(localTime / 720)} months`;
    if (localTime > 719) return `${Math.trunc(localTime / 720)} month`;
    if (localTime > 333) return `${Math.trunc(localTime / 168)} weeks`;
    if (localTime > 167) return `${Math.trunc(localTime / 168)} week`;
    if (localTime > 47) return `${Math.trunc(localTime / 24)} days`;
    localTime = this.hours; // Readjust for small quantities
    if (localTime > 23) return `${Math.trunc(localTime / 24)} day`;
    if (localTime > 1) return `${localTime} hours`;
    return `${localTime} hour`;
  }

  timeInvestmentString() {
    if (this.hours === 1) return '1 hour';
    if (this.hours < 5) return `${this.hours} hours`;
    return `${this.hours} hours (${this.timeString()})`;
  }

  hasSingleImage() {
    return this.image.length < 2;
  }

  cardGradient() {
    if (this.props && this.props.light) return 'to bottom, black, transparent 60%, transparent';
    return '';
  }

  hasNoArt() {
    return this.artList.length < 1;
  }

  pageTitle() {
    return `${this.name} - The Shills List`;
  }
}
