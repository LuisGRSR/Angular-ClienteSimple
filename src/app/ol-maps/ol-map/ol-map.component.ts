import {Component, OnInit, AfterViewInit, Input, ElementRef, Injectable, Output, EventEmitter} from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import XYZ from 'ol/source/XYZ';
import { OSM } from 'ol/source';
import * as Proj from 'ol/proj';
import {
  defaults as defaultControls,
  Control
} from 'ol/control';
import { Observable, subscribeOn,of, Subject } from 'rxjs';
import { Coordinate } from 'ol/coordinate';
import { coordinateRelationship, createEmpty, createOrUpdateFromCoordinate } from 'ol/extent';
import { createOrUpdate } from 'ol/TileRange';

import { reverseGeocode } from '@esri/arcgis-rest-geocoding';


import {Punto} from "../../punto/punto.types";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import VectorSource from "ol/source/Vector";
import {ApiKey} from "@esri/arcgis-rest-auth";

import { AppComponent } from 'src/app/app.component';

export const DEFAULT_HEIGHT = '500px';
export const DEFAULT_WIDTH = '500px';

export const DEFAULT_LAT = -34.603490361131385;
export const DEFAULT_LON = -58.382037891217465;

export const DEFAULT_ANCHOR = [0.5, 1];
export const DEFAULT_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAyVBMVEUAAADnTDznTDvnTDvnTDvAOCrnTDznSzvnTDvAOCvnTDznTDznTDvnTDzAOCrnTDvnTDvnTDvnTDznTDvAOSrnTDznTDzTQjLSQjPnTDzpTDvnSzvAOCrnTDvAOSvAOCvnSzvnTDzAOCvnSzznTDznTDvnTDy/OCvnTDznTDvnTDznSzvmSzvAOCvnTDzAOCvnTDvmTDvAOCq+OCrpTDzkSzrbRjbWRDTMPi+8NinrTT3EOy3gSDjTQjPPQDLHPS/DOiu5NCjHPC5jSfbDAAAAMHRSTlMAKPgE4hr8CfPy4NzUt7SxlnpaVlRPIhYPLgLt6ebOysXAwLmej4iGgGtpYkpAPCBw95QiAAAB50lEQVQ4y42T13aDMAxAbVb2TrO6927lwQhktf//UZWVQ1sIJLnwwBEXWZYwy1Lh/buG5TXu+rzC9nByDQCCbrg+KdUmLUsgW08IqzUp9rgDf5Ds8CJv1KS3mNL3fbGlOdr1Kh1AtFgs15vke7kQGpDO7pYGtJgfbRSxiXxaf7AjgsFfy1/WPu0r73WpwGiu1Fn78bF9JpWKUBTQzYlNQIK5lDcuQ9wbKeeBiTWz3vgUv44TpS4njJhcKpXEuMzpOCN+VE2FmPA9jbxjSrOf6kdG7FvYmkBJ6aYRV0oVYIusfkZ8xeHpUMna+LeYmlShxkG+Zv8GyohLf6aRzzRj9t+YVgWaX1IO08hQyi9tapxmB3huxJUp8q/EVYzB89wQr0y/FwqrHLqoDWsoLsxQr1iWNxp1iCnlRbt9IdELwfDGcrSMKJbGxLx4LenTFsszFSYehwl6aCZhTNPnO6LdBYOGYBVFqwAfDF27+CQIvLUGrTU9lpyFBw9yeA+sCNsRkJ5WQjg2K+QFcrywEjoCBHVpe3VYGZyk9NQCLxXte/jHvc1K4XXKSNQ520PPtIhcr8f2MXPShNiavTyn4jM7wK0g75YdYgTE6KA465nN9GbsILwhoMHZETx53hM7Brtet9lRDAYFwR80rG+sfAnbpQAAAABJRU5ErkJggg==';


@Component({
  selector: 'ol-map',
  templateUrl: './ol-map.component.html',
  styleUrls: ['./ol-map.component.css']
})
export class OlMapComponent implements OnInit, AfterViewInit {
  @Input() lat: number = DEFAULT_LAT;
  @Input() lon: number = DEFAULT_LON;
  @Input() zoom: number;
  @Input() width: string | number = DEFAULT_WIDTH;
  @Input() height: string | number = DEFAULT_HEIGHT;
  @Input() editable:Boolean=true;
  @Output() coords = new EventEmitter();
  @Output() details = new EventEmitter();



  target: string = 'map-' + Math.random().toString(36).substring(2);
  map: Map;
  coord: String;
  private mapEl: HTMLElement ;
  private appComponent: AppComponent;

  constructor(private elementRef: ElementRef) { 
    this.coord="";
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.mapEl = this.elementRef.nativeElement.querySelector('#' + this.target);
    this.setSize();

    this.map = new Map({
      target: this.target,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: Proj.fromLonLat([this.lon, this.lat]),
        zoom: this.zoom
      }),
      controls: defaultControls({attribution: false, zoom: false}).extend([])
    });


  
    //this.map.addEventListener('',this.appComponent.getDetails())

    this.map.on('singleclick', (evt: { coordinate: any; }) => {
      if (this.editable==true) {
      console.log(Proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'));
      const val=Proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
      const apiKey = "AAPKe7e9e641b2594bcd8a442aacf2ae6af88DgPyTzgqBBhuz8ds2RVhFMghvinRsIbypA1ujz2NHnsujLkkfGJLQtliT3voYXy";
      const authentication = new ApiKey({
            key: apiKey
        });
     // @ts-ignore
        reverseGeocode(val,{authentication}).then((response) => {
            const punto=new Punto();
            punto.name=response.address['LongLabel'];
            punto.lon=val[0];
            punto.lat=val[1];
            const marker = new Feature({
                geometry: new Point(Proj.fromLonLat([punto.lon, punto.lat]))
            });
            const markerText = new Feature({
                geometry: new Point(Proj.fromLonLat([punto.lon, punto.lat]))
            });

            const icon = new Style({
                image: new Icon({
                    anchor: DEFAULT_ANCHOR,
                    src: DEFAULT_ICON,
                })
            });

            const text = new Style({
                text: new Text({
                    text:  punto.name,
                    font: 'bold 12px arial',
                    offsetY: 8,
                    fill: new Fill({color: 'rgb(0,0,0)'}),
                    stroke: new Stroke({color: 'rgb(255,255,255)', width: 1})
                })
            });

            marker.setStyle(icon);
            markerText.setStyle(text);

            const vectorSource = new VectorSource({
                features: [marker, markerText]
            });

            const vectorLayer = new VectorLayer({
                source: vectorSource
            });

            vectorLayer.setZIndex(10);
            vectorLayer.set('name', 'Marker');
            this.setMarker(vectorLayer);

            this.coords.emit(punto);
        });
     }})

     


     
  }

  getDetails(coordinate:any){

    const val=Proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
    const apiKey = "AAPKe7e9e641b2594bcd8a442aacf2ae6af88DgPyTzgqBBhuz8ds2RVhFMghvinRsIbypA1ujz2NHnsujLkkfGJLQtliT3voYXy";
    const authentication = new ApiKey({
          key: apiKey
      });
       
    // @ts-ignore
    reverseGeocode(val,{authentication}).then((response) => {
      const punto=new Punto();
      punto.name=response.address['LongLabel'];
      punto.lon=val[0];
      punto.lat=val[1];
      const marker = new Feature({
          geometry: new Point(Proj.fromLonLat([punto.lon, punto.lat]))
      });
      const markerText = new Feature({
          geometry: new Point(Proj.fromLonLat([punto.lon, punto.lat]))
      });
      this.details.emit(punto);
    });
    
  }


  

  private setSize() {
    if (this.mapEl) {
      const styles = this.mapEl.style;
      styles.height = coerceCssPixelValue(this.height) || DEFAULT_HEIGHT;
      styles.width = coerceCssPixelValue(this.width) || DEFAULT_WIDTH;
    }
  }

  public setMarker(vector: any) {
    this.map.addLayer(vector);
  }

  public setControl(control: Control) {
    this.map.addControl(control);
  }

  

}

const cssUnitsPattern = /([A-Za-z%]+)$/;

function coerceCssPixelValue(value: any): string {
  if (value == null) {
    return '';
  }

  return cssUnitsPattern.test(value) ? value : `${value}px`;
}




