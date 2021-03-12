import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExceptionReportService } from '../../../services/exception-report.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import * as R from 'leaflet-responsive-popup';
import { AppServiceComponent, globalMap } from '../../../app.service';

@Component({
  selector: 'app-semester-exception',
  templateUrl: './semester-exception.component.html',
  styleUrls: ['./semester-exception.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SemesterExceptionComponent implements OnInit {
  public title: string = '';
  public titleName: string = '';
  public colors: any;

  // to assign the count of below values to show in the UI footer
  public studentCount: any;
  public schoolCount: any;
  public dateRange: any = '';

  // to hide and show the hierarchy details
  public skul: boolean = true;
  public dist: boolean = false;
  public blok: boolean = false;
  public clust: boolean = false;

  // to hide the blocks and cluster dropdowns
  public blockHidden: boolean = true;
  public clusterHidden: boolean = true;

  // to set the hierarchy names
  public districtHierarchy: any = '';
  public blockHierarchy: any = '';
  public clusterHierarchy: any = '';

  // leaflet layer dependencies
  public layerMarkers = new L.layerGroup();
  public markersList = new L.FeatureGroup();

  // assigning the data to each of these to show in dropdowns and maps
  // for dropdowns
  public data: any;
  public markers: any = [];
  // for maps
  public districtMarkers: any = [];
  public blockMarkers: any = [];
  public clusterMarkers: any = [];
  public schoolMarkers: any = [];

  // to show and hide the dropdowns based on the selection of buttons
  public stateLevel: any = 0; // 0 for buttons and 1 for dropdowns

  // to download the excel report
  public fileName: any;
  public reportData: any = [];

  // variables
  public districtId: any = '';
  public blockId: any = '';
  public clusterId: any = '';

  public semesters = [];
  public semester;
  public levelWise = 'district';

  public myData;
  state: string;
  // initial center position for the map
  public lat: any;
  public lng: any;

  reportName = 'semester_exception';

  constructor(
    public http: HttpClient,
    public service: ExceptionReportService,
    public commonService: AppServiceComponent,
    public router: Router,
    private changeDetection: ChangeDetectorRef,
  ) {
  }

  width = window.innerWidth;
  heigth = window.innerHeight;
  onResize() {
    this.width = window.innerWidth;
    this.heigth = window.innerHeight;
    this.commonService.zoomLevel = this.width > 3820 ? this.commonService.mapCenterLatlng.zoomLevel + 2 : this.width < 3820 && this.width >= 2500 ? this.commonService.mapCenterLatlng.zoomLevel + 1 : this.width < 2500 && this.width > 1920 ? this.commonService.mapCenterLatlng.zoomLevel + 1 : this.commonService.mapCenterLatlng.zoomLevel;
    this.changeDetection.detectChanges();
    this.levelWiseFilter();
  }
  setZoomLevel(lat, lng, globalMap, zoomLevel) {
    globalMap.setView(new L.LatLng(lat, lng), zoomLevel);
    globalMap.options.minZoom = this.commonService.zoomLevel;
    this.changeDetection.detectChanges();
  }
  getMarkerRadius(rad1, rad2, rad3, rad4) {
    let radius = this.width > 3820 ? rad1 : this.width > 2500 && this.width < 3820 ? rad2 : this.width < 2500 && this.width > 1920 ? rad3 : rad4;
    return radius;
  }

  ngOnInit() {
    this.state = this.commonService.state;
    this.lat = this.commonService.mapCenterLatlng.lat;
    this.lng = this.commonService.mapCenterLatlng.lng;
    this.changeDetection.detectChanges();
    this.commonService.initMap('semExMap', [[this.lat, this.lng]]);
    globalMap.setMaxBounds([[this.lat - 4.5, this.lng - 6], [this.lat + 3.5, this.lng + 6]]);
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    this.service.semExceptionMetaData().subscribe(res => {
      this.semesters = res['data'];
      this.semester = this.semesters[this.semesters.length - 1].id;
      this.onResize();
    }, err => {
      this.semesters = [];
      this.commonService.loaderAndErr(this.semesters);
    })
  }

  semSelect() {
    this.levelWiseFilter();
  }

  levelWiseFilter() {
    if (this.skul) {
      if (this.levelWise === "district") {
        this.districtWise();
      }
      if (this.levelWise === "block") {
        this.blockWise();
      }
      if (this.levelWise === "cluster") {
        this.clusterWise();
      }
      if (this.levelWise === "school") {
        this.schoolWise();
      }
    } else {
      if (this.dist && this.districtId !== undefined) {
        this.onDistrictSelect(this.districtId);
      }
      if (this.blok && this.blockId !== undefined) {
        this.onBlockSelect(this.blockId);
      }
      if (this.clust && this.clusterId !== undefined) {
        this.onClusterSelect(this.clusterId);
      }
    }
  }

  homeClick() {
    this.skul = true;
    this.dist = false;
    this.blok = false;
    this.clust = false;
    this.levelWise = "district";
    this.onResize();
  }

  // to load all the districts for state data on the map
  districtWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.districtId = undefined;
      this.commonService.errMsg();
      this.reportData = [];
      this.schoolCount = '';

      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      // api call to get all the districts data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.semCompletionDist({ sem: this.semester }).subscribe(res => {
        this.data = res;
        // to show only in dropdowns
        this.districtMarkers = this.data['data'];

        // options to set for markers in the map
        let options = {
          radius: this.getMarkerRadius(14, 10, 8, 5),
          fillOpacity: 1,
          strokeWeight: 0.01,
          weight: 1,
          mapZoom: this.commonService.zoomLevel,
          centerLat: this.lat,
          centerLng: this.lng,
          level: 'district'
        }

        this.commonService.restrictZoom(globalMap);
        globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
        this.setZoomLevel(options.centerLat, options.centerLng, globalMap, options.mapZoom);
        this.fileName = `${this.reportName}_${this.semester}nd_sem_allDistricts_${this.commonService.dateAndTime}`;
        this.genericFun(this.data, options, this.fileName);

        // sort the districtname alphabetically
        this.districtMarkers.sort((a, b) => (a.district_name > b.district_name) ? 1 : ((b.district_name > a.district_name) ? -1 : 0));
      }, err => {
        this.data = [];
        this.commonService.loaderAndErr(this.data);
      });
      // adding the markers to the map layers
      globalMap.addLayer(this.layerMarkers);
      document.getElementById('home').style.display = 'none';

    } catch (e) {
      console.log(e);
    }
  }

  // to load all the blocks for state data on the map
  blockWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      this.levelWise = "block";
      this.fileName = `${this.reportName}_${this.semester}nd_sem_allBlocks_${this.commonService.dateAndTime}`;
      this.schoolCount = '';

      this.reportData = [];
      this.districtId = undefined;
      this.blockId = undefined;
      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      // api call to get the all clusters data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.semCompletionBlock({ sem: this.semester }).subscribe(res => {
        this.data = res
        let options = {
          mapZoom: this.commonService.zoomLevel,
          centerLat: this.lat,
          centerLng: this.lng,
          level: "Block"
        }
        if (this.data['data'].length > 0) {
          let result = this.data['data']
          this.blockMarkers = [];
          // generate color gradient
          let colors = this.commonService.getRelativeColors(result, { value: 'percentage_schools_with_missing_data', report: 'exception' });
          this.colors = colors;
          this.blockMarkers = result;

          if (this.blockMarkers.length !== 0) {
            for (let i = 0; i < this.blockMarkers.length; i++) {
              var markerIcon = this.commonService.initMarkers(this.blockMarkers[i].block_latitude, this.blockMarkers[i].block_longitude, this.commonService.relativeColorGredient(this.blockMarkers[i], { value: 'percentage_schools_with_missing_data', report: 'exception' }, colors), this.getMarkerRadius(12, 8, 6, 4), 0.1, 1, options.level);
              this.generateToolTip(this.blockMarkers[i], options.level, markerIcon, "block_latitude", "block_longitude");
            }

            this.commonService.restrictZoom(globalMap);
            globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
            this.setZoomLevel(options.centerLat, options.centerLng, globalMap, options.mapZoom);
            this.schoolCount = this.data['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

            this.commonService.loaderAndErr(this.data);
            this.changeDetection.markForCheck();
          }
        }
      }, err => {
        this.data = [];
        this.commonService.loaderAndErr(this.data);
      });
      globalMap.addLayer(this.layerMarkers);
      document.getElementById('home').style.display = 'block';
    } catch (e) {
      console.log(e);
    }
  }

  // to load all the clusters for state data on the map
  clusterWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      this.levelWise = "cluster";
      this.schoolCount = '';
      this.fileName = `${this.reportName}_${this.semester}nd_sem_allClusters_${this.commonService.dateAndTime}`;

      this.reportData = [];
      this.districtId = undefined;
      this.blockId = undefined;
      this.clusterId = undefined;

      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      // api call to get the all clusters data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.semCompletionCluster({ sem: this.semester }).subscribe(res => {
        this.data = res
        let options = {
          mapZoom: this.commonService.zoomLevel,
          centerLat: this.lat,
          centerLng: this.lng,
          level: "Cluster"
        }
        if (this.data['data'].length > 0) {
          let result = this.data['data'];
          this.clusterMarkers = [];
          // generate color gradient
          let colors = this.commonService.getRelativeColors(result, { value: 'percentage_schools_with_missing_data', report: 'exception' });
          this.colors = colors;
          this.clusterMarkers = result;

          if (this.clusterMarkers.length !== 0) {
            for (let i = 0; i < this.clusterMarkers.length; i++) {
              var markerIcon = this.commonService.initMarkers(this.clusterMarkers[i].cluster_latitude, this.clusterMarkers[i].cluster_longitude, this.commonService.relativeColorGredient(this.clusterMarkers[i], { value: 'percentage_schools_with_missing_data', report: 'exception' }, colors), this.getMarkerRadius(2.5, 1.8, 1.5, 1), 0.01, 0.5, options.level);

              this.generateToolTip(this.clusterMarkers[i], options.level, markerIcon, "cluster_latitude", "cluster_longitude");
            }

            this.commonService.restrictZoom(globalMap);
            globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
            this.setZoomLevel(options.centerLat, options.centerLng, globalMap, options.mapZoom);
            this.schoolCount = this.data['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

            this.commonService.loaderAndErr(this.data);
            this.changeDetection.markForCheck();
          }
        }
      }, err => {
        this.data = [];
        this.commonService.loaderAndErr(this.data);
      });
      globalMap.addLayer(this.layerMarkers);
      document.getElementById('home').style.display = 'block';
    } catch (e) {
      console.log(e);
    }
  }

  // to load all the schools for state data on the map
  schoolWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      this.levelWise = "school";
      this.schoolCount = '';
      this.fileName = `${this.reportName}_${this.semester}nd_sem_allSchools_${this.commonService.dateAndTime}`;

      this.reportData = [];
      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      // api call to get the all schools data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.semCompletionSchool({ sem: this.semester }).subscribe(res => {
        this.data = res
        let options = {
          mapZoom: this.commonService.zoomLevel,
          centerLat: this.lat,
          centerLng: this.lng,
          level: 'school'
        }
        this.schoolMarkers = [];
        if (this.data['data'].length > 0) {
          let result = this.data['data']
          result = result.sort((a, b) => (parseInt(a.percentage_schools_with_missing_data) < parseInt(b.percentage_schools_with_missing_data)) ? 1 : -1)
          // generate color gradient
          let colors = result.length == 1 ? ['red'] : this.commonService.exceptionColor().generateGradient('#FF0000', '#FF0000', result.length, 'rgb');
          this.colors = colors;

          this.schoolMarkers = result;
          if (this.schoolMarkers.length !== 0) {
            for (let i = 0; i < this.schoolMarkers.length; i++) {
              var markerIcon = this.commonService.initMarkers(this.schoolMarkers[i].school_latitude, this.schoolMarkers[i].school_longitude, this.colors[i], this.getMarkerRadius(1.5, 1.2, 1, 0), 0, 0.3, options.level);

              this.generateToolTip(this.schoolMarkers[i], options.level, markerIcon, "school_latitude", "school_longitude");
            }

            globalMap.doubleClickZoom.enable();
            globalMap.scrollWheelZoom.enable();
            globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
            globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), this.commonService.zoomLevel);

            this.schoolCount = this.data['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

            this.commonService.loaderAndErr(this.data);
            this.changeDetection.markForCheck();
          }
        }
      }, err => {
        this.data = [];
        this.commonService.loaderAndErr(this.data);
      });

      globalMap.addLayer(this.layerMarkers);
      document.getElementById('home').style.display = 'block';
    } catch (e) {
      console.log(e);
    }
  }

  // to load all the blocks for selected district for state data on the map
  onDistrictSelect(districtId) {
    // to clear the existing data on the map layer  
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();
    this.blockId = undefined;

    // to show and hide the dropdowns
    this.blockHidden = false;
    this.clusterHidden = true;

    // api call to get the blockwise data for selected district
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.semCompletionBlockPerDist(districtId, { sem: this.semester }).subscribe(res => {
      this.data = res;

      this.blockMarkers = this.data['data'];
      // set hierarchy values
      this.districtHierarchy = {
        distId: this.data['data'][0].district_id,
        districtName: this.data['data'][0].district_name
      }

      this.districtId = districtId;

      // these are for showing the hierarchy names based on selection
      this.skul = false;
      this.dist = true;
      this.blok = false;
      this.clust = false;

      // options to set for markers in the map
      let options = {
        radius: this.getMarkerRadius(14, 10, 8, 4),
        fillOpacity: 1,
        strokeWeight: 0.01,
        weight: 1,
        mapZoom: this.commonService.zoomLevel + 1,
        centerLat: this.data['data'][0].block_latitude,
        centerLng: this.data['data'][0].block_longitude,
        level: 'block'
      }

      this.commonService.restrictZoom(globalMap);
      globalMap.setMaxBounds([[options.centerLat - 1.5, options.centerLng - 3], [options.centerLat + 1.5, options.centerLng + 2]]);
      this.setZoomLevel(options.centerLat, options.centerLng, globalMap, options.mapZoom);
      this.fileName = `${this.reportName}_${this.semester}nd_sem_${options.level}s_of_district_${districtId}_${this.commonService.dateAndTime}`;
      this.genericFun(this.data, options, this.fileName);
      // sort the blockname alphabetically
      this.blockMarkers.sort((a, b) => (a.block_name > b.block_name) ? 1 : ((b.block_name > a.block_name) ? -1 : 0));
    }, err => {
      this.data = [];
      this.commonService.loaderAndErr(this.data);
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  // to load all the clusters for selected block for state data on the map
  onBlockSelect(blockId) {
    // to clear the existing data on the map layer
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();
    this.clusterId = undefined;

    // to show and hide the dropdowns
    this.blockHidden = false;
    this.clusterHidden = false;

    // api call to get the clusterwise data for selected district, block
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.semCompletionClusterPerBlock(this.districtHierarchy.distId, blockId, { sem: this.semester }).subscribe(res => {
      this.data = res;
      this.clusterMarkers = this.data['data'];
      var myBlocks = [];
      this.blockMarkers.forEach(element => {
        if (element.district_id === this.districtHierarchy.distId) {
          myBlocks.push(element);
        }
      });
      this.blockMarkers = myBlocks;

      // set hierarchy values
      this.blockHierarchy = {
        distId: this.data['data'][0].district_id,
        districtName: this.data['data'][0].district_name,
        blockId: this.data['data'][0].block_id,
        blockName: this.data['data'][0].block_name
      }
      this.districtId = this.data['data'][0].district_id;
      this.blockId = blockId;

      // these are for showing the hierarchy names based on selection
      this.skul = false;
      this.dist = false;
      this.blok = true;
      this.clust = false;

      // options to set for markers in the map
      let options = {
        radius: this.getMarkerRadius(14, 10, 8, 4),
        fillOpacity: 1,
        strokeWeight: 0.01,
        weight: 1,
        mapZoom: this.commonService.zoomLevel + 3,
        centerLat: this.data['data'][0].cluster_latitude,
        centerLng: this.data['data'][0].cluster_longitude,
        level: 'cluster'
      }

      this.commonService.restrictZoom(globalMap);
      globalMap.setMaxBounds([[options.centerLat - 1.5, options.centerLng - 3], [options.centerLat + 1.5, options.centerLng + 2]]);
      this.setZoomLevel(options.centerLat, options.centerLng, globalMap, options.mapZoom);
      this.fileName = `${this.reportName}_${this.semester}nd_sem_${options.level}s_of_block_${blockId}_${this.commonService.dateAndTime}`;
      this.genericFun(this.data, options, this.fileName);
      // sort the clusterName alphabetically
      this.clusterMarkers.sort((a, b) => (a.cluster_name > b.cluster_name) ? 1 : ((b.cluster_name > a.cluster_name) ? -1 : 0));
    }, err => {
      this.data = [];
      this.commonService.loaderAndErr(this.data);
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  // to load all the schools for selected cluster for state data on the map
  onClusterSelect(clusterId) {
    // to clear the existing data on the map layer
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();

    this.blockHidden = false;
    this.clusterHidden = false;
    // api call to get the schoolwise data for selected district, block, cluster
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.semCompletionBlock({ sem: this.semester }).subscribe(result => {
      this.myData = this.service.semCompletionSchoolPerClustter(this.blockHierarchy.distId, this.blockHierarchy.blockId, clusterId, { sem: this.semester }).subscribe(res => {
        this.data = res;
        this.schoolMarkers = this.data['data'];

        var markers = result['data'];
        var myBlocks = [];
        markers.forEach(element => {
          if (element.district_id === this.blockHierarchy.distId) {
            myBlocks.push(element);
          }
        });
        this.blockMarkers = myBlocks;

        var myCluster = [];
        this.clusterMarkers.forEach(element => {
          if (element.block_id === this.blockHierarchy.blockId) {
            myCluster.push(element);
          }
        });
        this.clusterMarkers = myCluster;

        // set hierarchy values
        this.clusterHierarchy = {
          distId: this.data['data'][0].district_id,
          districtName: this.data['data'][0].district_name,
          blockId: this.data['data'][0].block_id,
          blockName: this.data['data'][0].block_name,
          clusterId: this.data['data'][0].cluster_id,
          clusterName: this.data['data'][0].cluster_name,
        }

        this.districtHierarchy = {
          distId: this.data['data'][0].district_id
        }

        this.districtId = this.data['data'][0].district_id;
        this.blockId = this.data['data'][0].block_id;
        this.clusterId = clusterId;

        // these are for showing the hierarchy names based on selection
        this.skul = false;
        this.dist = false;
        this.blok = false;
        this.clust = true;

        // options to set for markers in the map
        let options = {
          radius: this.getMarkerRadius(14, 10, 8, 4),
          fillOpacity: 1,
          strokeWeight: 0.01,
          weight: 1,
          mapZoom: this.commonService.zoomLevel + 5,
          centerLat: this.data['data'][0].school_latitude,
          centerLng: this.data['data'][0].school_longitude,
          level: 'school'
        }
        globalMap.doubleClickZoom.enable();
        globalMap.scrollWheelZoom.enable();
        globalMap.setMaxBounds([[options.centerLat - 1.5, options.centerLng - 3], [options.centerLat + 1.5, options.centerLng + 2]]);
        this.setZoomLevel(options.centerLat, options.centerLng, globalMap, options.mapZoom);
        this.fileName = `${this.reportName}_${this.semester}nd_sem_${options.level}s_of_cluster_${clusterId}_${this.commonService.dateAndTime}`;
        this.genericFun(this.data, options, this.fileName);
      }, err => {
        this.data = [];
        this.commonService.loaderAndErr(this.data);
      });
    }, err => {
      this.data = [];
      this.commonService.loaderAndErr(this.data);
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  // common function for all the data to show in the map
  genericFun(data, options, fileName) {
    this.reportData = [];
    this.schoolCount = '';

    if (data['data'].length > 0) {
      this.markers = data['data']
      this.markers = this.markers.sort((a, b) => (parseInt(a.percentage_schools_with_missing_data) < parseInt(b.percentage_schools_with_missing_data)) ? 1 : -1)
      // generate color gradient
      let colors;
      colors = this.commonService.getRelativeColors(this.markers, { value: 'percentage_schools_with_missing_data', report: 'exception' });
      this.colors = colors;

      // attach values to markers
      for (var i = 0; i < this.markers.length; i++) {
        var lat, strLat; var lng, strLng;
        if (options.level == "district") {
          lat = this.markers[i].district_latitude;
          strLat = "district_latitude";
          lng = this.markers[i].district_longitude;
          strLng = "district_longitude";
        }
        if (options.level == "block") {
          lat = this.markers[i].block_latitude;
          strLat = "block_latitude";
          lng = this.markers[i].block_longitude;
          strLng = "block_longitude";
        }
        if (options.level == "cluster") {
          lat = this.markers[i].cluster_latitude;
          strLat = "cluster_latitude";
          lng = this.markers[i].cluster_longitude;
          strLng = "cluster_longitude";
        }
        if (options.level == "school") {
          lat = this.markers[i].school_latitude;
          strLat = "school_latitude";
          lng = this.markers[i].school_longitude;
          strLng = "school_longitude";
        }

        var markerIcon;
        markerIcon = this.commonService.initMarkers(lat, lng, this.commonService.relativeColorGredient(this.markers[i], { value: 'percentage_schools_with_missing_data', report: 'exception' }, colors), options.radius, options.strokeWeight, options.weight, options.level);

        // data to show on the tooltip for the desired levels
        if (options.level) {
          this.generateToolTip(this.markers[i], options.level, markerIcon, strLat, strLng);
          // to download the report
          this.fileName = fileName;
        }
      }

      this.commonService.loaderAndErr(this.data);
      this.changeDetection.markForCheck();
    }
    this.schoolCount = this.data['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  }

  popups(markerIcon, markers, level) {
    for (var i = 0; i < this.markers.length; i++) {
      markerIcon.on('mouseover', function (e) {
        this.openPopup();
      });
      markerIcon.on('mouseout', function (e) {
        this.closePopup();
      });

      this.layerMarkers.addLayer(markerIcon);
      if (level != 'school') {
        markerIcon.on('click', this.onClick_Marker, this)
      }
      markerIcon.myJsonData = markers;
    }
  }

  //Showing tooltips on markers on mouse hover...
  onMouseOver(m, infowindow) {
    m.lastOpen = infowindow;
    m.lastOpen.open();
  }

  //Hide tooltips on markers on mouse hover...
  hideInfo(m) {
    if (m.lastOpen != null) {
      m.lastOpen.close();
    }
  }

  // drilldown/ click functionality on markers
  onClick_Marker(event) {
    var data = event.target.myJsonData;
    if (data.district_id && !data.block_id && !data.cluster_id) {
      this.stateLevel = 1;
      this.onDistrictSelect(data.district_id)
    }
    if (data.district_id && data.block_id && !data.cluster_id) {
      this.stateLevel = 1;
      this.districtHierarchy = {
        distId: data.district_id
      }
      this.onBlockSelect(data.block_id)
    }
    if (data.district_id && data.block_id && data.cluster_id) {
      this.stateLevel = 1;
      this.blockHierarchy = {
        distId: data.district_id,
        blockId: data.block_id
      }
      this.onClusterSelect(data.cluster_id)
    }
  }

  // to download the excel report
  downloadReport() {
    this.reportData.forEach(element => {
      if (element.number_of_schools != undefined) {
        element['number_of_schools'] = element.number_of_schools.replace(/\,/g, '');
      }
    });
    this.commonService.download(this.fileName, this.reportData);
  }

  generateToolTip(markers, level, markerIcon, lat, lng) {
    this.popups(markerIcon, markers, level);
    var details = {};
    var orgObject = {};
    Object.keys(markers).forEach(key => {
      if (key !== lat) {
        details[key] = markers[key];
      }
    });
    Object.keys(details).forEach(key => {
      if (key !== lng) {
        orgObject[key] = details[key];
      }
    });
    var detailSchool = {};
    var yourData;
    if (level == "school") {
      Object.keys(orgObject).forEach(key => {
        if (key !== "total_schools_with_missing_data") {
          detailSchool[key] = orgObject[key];
        }
      });
      this.reportData.push(detailSchool);
      yourData = this.commonService.getInfoFrom(detailSchool, "percentage_schools_with_missing_data", level, "sem-exception", undefined, undefined).join(" <br>");
    } else {
      this.reportData.push(orgObject);
      yourData = this.commonService.getInfoFrom(orgObject, "percentage_schools_with_missing_data", level, "sem-exception", undefined, undefined).join(" <br>");

    }
    //Generate dynamic tool-tip
    const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
      yourData);
    markerIcon.addTo(globalMap).bindPopup(popup);
  }
}
