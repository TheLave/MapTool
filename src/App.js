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
				'shoreline': {
					name: 'Shoreline',
					icon: 'fa-solid fa-water',
					active: false,
					center: [500, 1000],
					bounds: [[0,0], [1000,2000]],
					image: 'maps/eft-shoreline-map.png',
				},
				'lighthouse': {
					name: 'Lighthouse',
					icon: 'fa-solid fa-tower-observation',
					active: false,
					center: [350, 600],
					bounds: [[0,0], [700,1200]],
					image: 'maps/eft-lighthouse-map.png',
				},
				'interchange': {
					name: 'Interchange',
					icon: 'fa-solid fa-cart-shopping',
					active: false,
					center: [700, 1125],
					bounds: [[0,0], [1400,2250]],
					image: 'maps/eft-interchange-map.png',
				}
			},
			currentMap: 'woods',
			zoom: 2,
			iconWidth: 25,
			iconHeight: 40,
			markers: [],
			markerMenu: false,
			menuType: 'edit',
			newMarkerLabel: '',
			newMarkerColor: 'Blue',
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
		filteredMarkers() {
			return this.markers.filter(item => {
				return this.setFilters.includes(item.color);
			})
		},
	},
	methods: {
		log(a) {
			console.log(a);
		},
		openMap(map) {
			this.currentMap = map;
			this.loadMapMarkers();
		},
		prepareNewMarker(data) {
			this.menuType = 'new'
			this.recentData = data
			this.markerMenu = true
		},
		prepareMarkerOptions(data) {
			this.menuType = 'edit'
			this.recentData = data
			for (let i = 0; i < this.markers.length; i++) {
				if (this.markers[i].latlng[0] === this.recentData.latlng.lat && this.markers[i].latlng[1] === this.recentData.latlng.lng) {
					this.editMarkerLabel = this.markers[i].tooltip
					this.editMarkerColor = this.markers[i].color
				}
			}
		},
		addMarker() {
			this.markers.push({
				tooltip: this.newMarkerLabel,
				latlng: [this.recentData.latlng.lat, this.recentData.latlng.lng],
				color: this.newMarkerColor,
				icon: icon({iconUrl: `markers/marker-${this.newMarkerColor.toLowerCase()}.png`, iconSize: [50, 50], iconAnchor: [25, 50]})
			})
			$.ajax({
				url: 'http://192.168.2.112:8080/addMarker',
				type: 'post',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify({
					map: this.currentMap,
					tooltip: this.newMarkerLabel,
					lat: this.recentData.latlng.lat,
					lng: this.recentData.latlng.lng,
					color: this.newMarkerColor
				})
			});
			this.newMarkerLabel = ''
		},
		removeMarker() {
			for (let i = 0; i < this.markers.length; i++) {
				if (this.markers[i].latlng[0] === this.recentData.latlng.lat && this.markers[i].latlng[1] === this.recentData.latlng.lng) {
					$.ajax({
						url: 'http://192.168.2.112:8080/removeMarker',
						type: 'post',
						dataType: 'json',
						contentType: 'application/json',
						data: JSON.stringify({
							id: this.markers[i].id
						})
					});
					this.markers.splice(i, 1)
				}
			}
		},
		editMarker() {
			for (let i = 0; i < this.markers.length; i++) {
				if (this.markers[i].latlng[0] === this.recentData.latlng.lat && this.markers[i].latlng[1] === this.recentData.latlng.lng) {
					this.markers[i] = {
						id: this.markers[i].id,
						tooltip: this.editMarkerLabel,
						latlng: [this.recentData.latlng.lat, this.recentData.latlng.lng],
						color: this.editMarkerColor,
						icon: icon({iconUrl: `markers/marker-${this.editMarkerColor}.png`, iconSize: [50, 50], iconAnchor: [25, 50]})
					}
					this.editMarkerLabel = ''
					$.ajax({
						url: 'http://192.168.2.112:8080/editMarker',
						type: 'post',
						dataType: 'json',
						contentType: 'application/json',
						data: JSON.stringify({
							id: this.markers[i].id,
							color: this.markers[i].color,
							tooltip: this.markers[i].tooltip
						})
					});
				}
			}
		},
		loadMapMarkers() {
			$.get(`http://192.168.2.112:8080/${this.currentMap}`, data => {
				this.markers = []
				for (let marker of JSON.parse(data)) {
					this.markers.push({
						id: marker.id,
						tooltip: marker.tooltip,
						latlng: [marker.lat, marker.lng],
						color: marker.color,
						icon: icon({iconUrl: `markers/marker-${marker.color}.png`, iconSize: [50, 50], iconAnchor: [25, 50]})
					})
				}
			})
		}
	},
	mounted() {
		this.loadMapMarkers()
		window.setInterval(this.loadMapMarkers, 2000)
	},
	setup() {
		return {
			newMarkerPrompt: ref(false),
			editMarkerPrompt: ref(false),
			drawer: ref(false),
			miniState: ref(true),

			setFilters: ref(['Blue', 'Red', 'Green', 'Purple', 'Orange']),
			filterOptions: [
				{
					label: 'Blue (Callout)',
					value: 'Blue'
				},
				{
					label: 'Red (Mines)',
					value: 'Red'
				},
				{
					label: 'Green (Lootables)',
					value: 'Green'
				},
				{
					label: 'Purple (Spawn point)',
					value: 'Purple'
				},
				{
					label: 'Orange (Extract)',
					value: 'Orange'
				},
			]
		}
	}
};