import {Component, NgZone} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { WatchList } from './watch-list/WatchList';
import { ApiService } from './api.service';


import * as EventSource from 'eventsource';
import {Observable} from 'rxjs/Observable';
import { CompileShallowModuleMetadata } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  eventSource: any = window['EventSource'];

  constructor(private http: HttpClient, private api: ApiService, private zone: NgZone) {
    this.getOptionsData();
  }

  title = 'marketdirection-frontend';
  name = "";
  url = '';
  selectedIndex = '';
  images = [];
  indexes = ['forex', 'niftyStockWatch', 'juniorNiftyStockWatch', 'niftyMidcap50StockWatch', 'niftyMidcap150OnlineStockWatch',
    'niftySmallcap50OnlineStockWatch', 'niftySmallcap250OnlineStockWatch', 'niftyMidsml400OnlineStockWatch', 'dspMidCapStockWatch', 'dspSmallCapStockWatch'];
  scrips = [];
  selectedScrip: '';
  watchList = [];
  selectedWatchList = {};
// indexes = 'niftyStockWatch,juniorNiftyStockWatch,niftyMidcap50StockWatch,niftyMidcap150OnlineStockWatch,' +
//   'niftySmallcap50OnlineStockWatch,niftySmallcap250OnlineStockWatch,niftyMidsml400OnlineStockWatch'.split(',');


navbarOpen = false;

toggleNavbar() {
  this.navbarOpen = !this.navbarOpen;
}

  getScrips() {
    this.http.get('../assets/scrips_indexes/' + this.selectedIndex + '.json').subscribe(sc => {
      this.scrips = sc['data'];
    });
  }

  getOptionsData() {
    const localUrl="http://localhost:8080/v1/options?expiry=28/Apr/2016&date=28/Apr/2016";
    // this.api.getOptionsData("28/Apr/2016", "date=28/Apr/2016")
    // .subscribe(data => {
    //   console.log(data);
    // });


        // const es = new EventSource(localUrl);
        // es.onmessage = (evt) => {
        //   this.zone.run(() => {
        //     console.log(evt.data);
        //   });
        // };

        this.observeStream(localUrl).subscribe(data => {
          console.log(data);
        });

  }

  observeStream(sseUrl: string): Observable<any> {
    return new Observable<any>(obs => {

        const eventSource = new this.eventSource(sseUrl);

        eventSource.onmessage = event => {

            let data = JSON.parse(event.data);

            // $apply external (window.EventSource) event data
            this.zone.run(() => obs.next(data));

        };
        // close connection when observer unsubscribe
        return () => eventSource.close();
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


    watchItems: WatchList[] = [];
    url1: string = 'http://localhost:9101/v1/test';

    getWatchItemStream(): Observable<Array<WatchList>> {
      this.watchItems = [];
      console.log("Inside getWatchItemStream. : " + this.url1);
      return Observable.create((observer) => {
        let url11 = this.url1;

        console.log(url11);
        let eventSource = new EventSource(url11);
        eventSource.onmessage = (event) => {
          console.debug('Received event: ', event);
          let json = JSON.parse(event.data);
          this.watchItems.push(new WatchList(json['id'], json['name'], json['scrips']));
          observer.next(this.watchItems);
          console.log(this.watchItems);
        };
        eventSource.onerror = (error) => {
        console.log(error);
          // readyState === 0 (closed) means the remote source closed the connection,
          // so we can safely treat it as a normal situation. Another way of detecting the end of the stream
          // is to insert a special element in the stream of events, which the client can identify as the last one.
          if(eventSource.readyState === 0) {
            console.log('The stream has been closed by the server.');
            eventSource.close();
            observer.complete();
          } else {
            observer.error('EventSource error: ' + error);
          }
        }
      });
    }

}
