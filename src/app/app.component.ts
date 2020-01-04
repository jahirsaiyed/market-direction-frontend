import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpClient) {

  }

  title = 'marketdirection-frontend';
  name = "";
  url = '';
  selectedIndex = '';
  images = [];
  indexes = ['niftyStockWatch', 'juniorNiftyStockWatch', 'niftyMidcap50StockWatch', 'niftyMidcap150OnlineStockWatch',
    'niftySmallcap50OnlineStockWatch', 'niftySmallcap250OnlineStockWatch', 'niftyMidsml400OnlineStockWatch'];
  scrips = [];
  selectedScrip: '';
  watchList = [];
  selectedWatchList = {};
// indexes = 'niftyStockWatch,juniorNiftyStockWatch,niftyMidcap50StockWatch,niftyMidcap150OnlineStockWatch,' +
//   'niftySmallcap50OnlineStockWatch,niftySmallcap250OnlineStockWatch,niftyMidsml400OnlineStockWatch'.split(',');
  getScrips() {
    this.http.get('../assets/scrips_indexes/' + this.selectedIndex + '.json').subscribe(sc => {
      this.scrips = sc['data'];
    });
  }

  getImages() {
    this.images[0] = '../assets/images/' + this.selectedIndex + '/' + this.selectedScrip + '/WEEKLY.png';
    this.images[1] = '../assets/images/' + this.selectedIndex + '/' + this.selectedScrip + '/DAILY.png';
    this.images[2] = '../assets/images/' + this.selectedIndex + '/' + this.selectedScrip + '/HOURLY.png';
    this.name = this.selectedScrip;
  }

  loadFromWatchList() {
    this.images[0] = '../assets/images/' + this.selectedWatchList['index'] + '/' + this.selectedWatchList['scrip'] + '/WEEKLY.png';
    this.images[1] = '../assets/images/' + this.selectedWatchList['index'] + '/' + this.selectedWatchList['scrip'] + '/DAILY.png';
    this.images[2] = '../assets/images/' + this.selectedWatchList['index'] + '/' + this.selectedWatchList['scrip'] + '/HOURLY.png';
    this.name = this.selectedWatchList['scrip'];
  }

  addToWatchList() {
  var alreadyPresent = false;
    this.watchList.forEach((item, ind) => {
      if(item.index == this.selectedIndex && item.scrip == this.selectedScrip) {
        alreadyPresent = true;
        return ;
      }
    });
    if(alreadyPresent) return;
    this.watchList.push({
      "index" : this.selectedIndex,
      "scrip" : this.selectedScrip
    });
    console.log(this.watchList);
  }

  scripAction(event) {
    if(event && event.code=='Space' && event.ctrlKey===true) {
      this.addToWatchList();
    }
  }
}
