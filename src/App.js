import { ref } from 'vue';
import { LMap, LIcon, LTileLayer, LMarker, LControlLayers, LTooltip, LPopup, LPolyline, LPolygon, LRectangle, LImageOverlay } from "@vue-leaflet/vue-leaflet";
import { icon } from 'leaflet';
import "leaflet/dist/leaflet.css";

export default {
	components: {
		LMap,
		LIcon,
		LTileLayer,
		LMarker,
		LControlLayers,
		LTooltip,
		LPopup,
		LPolyline,
		LPolygon,
		LRectangle,
		LImageOverlay
	},
	data() {
		return {
			maps: {
				'woods': {
					name: 'Woods',
					icon: 'fa-solid fa-tree',
					active: true,
					center: [500, 500],
					bounds: [[0,0], [1000,1000]],
					image: 'maps/eft-woods-map.png',
				},
				'customs': {
					name: 'Customs',
					icon: 'fa-solid fa-box',
					active: false,
					center: [500, 1000],
					bounds: [[0,0], [1000,2000]],
					image: 'maps/eft-customs-map.png',
				},
			},
			currentMap: 'woods',
			zoom: 2,
			iconWidth: 25,
			iconHeight: 40,
			markers: [],
			markerMenu: false,
			menuType: 'edit',
			newMarkerLabel: '',
			newMarkerColor: '',
			editMarkerLabel: '',
			editMarkerColor: '',
			markerColors: ['Blue', 'Red', 'Green', 'Purple', 'Orange']
		};
	},
	computed: {
		iconUrl() {
			return `https://placekitten.com/${this.iconWidth}/${this.iconHeight}`;
		},
		iconSize() {
			return [this.iconWidth, this.iconHeight];
		},
	},
	methods: {
		log(a) {
			console.log(a);
		},
		openMap(map) {
			this.currentMap = map;
		},
		prepareNewMarker(data) {
			this.menuType = 'new'
			this.recentData = data
			this.markerMenu = true
		},
		prepareMarkerOptions(data) {
			this.menuType = 'edit'
			this.recentData = data
		},
		addMarker() {
			this.markers.push({
				tooltip: this.newMarkerLabel,
				latlng: [this.recentData.latlng.lat, this.recentData.latlng.lng],
				color: this.newMarkerColor,
				icon: icon({iconUrl: `markers/marker-${this.newMarkerColor.toLowerCase()}.png`, iconSize: [50, 50], iconAnchor: [25, 50]})
			})
			this.newMarkerLabel = ''
		},
		removeMarker() {
			for (let i = 0; i < this.markers.length; i++) {
				if (this.markers[i].latlng[0] === this.recentData.latlng.lat && this.markers[i].latlng[1] === this.recentData.latlng.lng) {
					this.markers.splice(i, 1)
				}
			}
		},
		editMarker() {
			for (let i = 0; i < this.markers.length; i++) {
				if (this.markers[i].latlng[0] === this.recentData.latlng.lat && this.markers[i].latlng[1] === this.recentData.latlng.lng) {
					this.markers[i] = {
						tooltip: this.editMarkerLabel,
						latlng: [this.recentData.latlng.lat, this.recentData.latlng.lng],
						color: this.editMarkerColor,
						icon: icon({iconUrl: `markers/marker-${this.editMarkerColor}.png`, iconSize: [50, 50], iconAnchor: [25, 50]})
					}
				}
			}
			this.editMarkerLabel = ''
		}
	},
	setup() {
		return {
			newMarkerPrompt: ref(false),
			editMarkerPrompt: ref(false),
			drawer: ref(false),
			miniState: ref(true)
		}
	}
};