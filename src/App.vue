<script src='./App.js'></script>

<template>
	<q-layout view="hHh LpR lff" container style="height: 100vh" class="shadow-2 rounded-borders">
		<q-header class="bg-black">
			<q-toolbar>
				<q-btn flat @click="drawer = !drawer" round dense icon="menu" />
				<q-toolbar-title>Lost Sanctum EFT Map Tool</q-toolbar-title>
			</q-toolbar>
		</q-header>
		<q-drawer v-model="drawer" show-if-above :mini="miniState" @mouseover="miniState = false" @mouseout="miniState = true" mini-to-overlay :width="200" :breakpoint="500" bordered class="bg-grey-3">
			<q-scroll-area class="fit z-max">
				<q-list padding>
					<q-item v-for="(map, mapName) in maps" clickable v-ripple :active="(currentMap == mapName)" @click="openMap(mapName)">
						<q-item-section avatar>
							<q-icon :name="map.icon"></q-icon>
						</q-item-section>
						<q-item-section>
							{{map.name}}
						</q-item-section>
					</q-item>
				</q-list>
			</q-scroll-area>
		</q-drawer>
		<q-page-container>
			<q-page padding>
				<div>
					<l-map :minZoom="-1" :maxZoom="4" crs="Simple" :center="maps[currentMap].center" :options="{doubleClickZoom: false, zoomSnap: 0.25, zoomDelta: 0.25, attributionControl: false, zoomControl: false}" @contextmenu="prepareNewMarker" style="height: 80vh; width: 90vw;">
						<q-menu context-menu touch-position>
							<q-list style="min-width: 100px">
								<q-item v-if="menuType == 'new'" clickable v-close-popup @click="newMarkerPrompt = true" icon="add">
									<q-item-section side>
										<q-icon name="add" />
									</q-item-section>
									<q-item-section>New marker</q-item-section>
								</q-item>
								<q-item v-if="menuType == 'edit'" clickable v-close-popup @click="editMarkerPrompt = true">
									<q-item-section side>
										<q-icon name="edit" />
									</q-item-section>
									<q-item-section>Edit marker</q-item-section>
								</q-item>
								<q-item v-if="menuType == 'edit'" clickable v-close-popup @click="removeMarker">
									<q-item-section side>
										<q-icon name="delete" />
									</q-item-section>
									<q-item-section>Remove marker</q-item-section>
								</q-item>
							</q-list>
						</q-menu>
						<l-image-overlay :url="maps[currentMap].image" :bounds="maps[currentMap].bounds"></l-image-overlay>
						<l-marker v-for="(marker, index) in filteredMarkers" :icon="marker.icon" :lat-lng="marker.latlng" @contextmenu="prepareMarkerOptions">
							<l-tooltip :options="{permanent: true, direction: 'top', offset: [0, -40]}">
								{{marker.tooltip}}
							</l-tooltip>
						</l-marker>
					</l-map>
				</div>
			</q-page>
		</q-page-container>
		<div class="markerFilter">
			<div class="text-h6">Filters</div>
			<q-option-group v-model="setFilters" :options="filterOptions" type="toggle" />
		</div>
	</q-layout>
	<q-dialog v-model="newMarkerPrompt">
		<q-card style="min-width: 350px">
			<q-card-section>
				<div class="text-h6">Marker label</div>
			</q-card-section>
			<q-card-section class="q-pt-none">
				<q-input dense v-model="newMarkerLabel" autofocus @keyup.enter="addMarker(); newMarkerPrompt = false" label="Label" />
			</q-card-section>
			<q-card-section class="q-pt-none">
				<q-select v-model="newMarkerColor" :options="markerColors" label="Type"/>
			</q-card-section>
			<q-card-actions align="right" class="text-primary">
				<q-btn flat label="Cancel" v-close-popup />
				<q-btn flat label="Add marker" @click="addMarker" v-close-popup />
			</q-card-actions>
		</q-card>
	</q-dialog>
	<q-dialog v-model="editMarkerPrompt">
		<q-card style="min-width: 350px">
			<q-card-section>
				<div class="text-h6">Marker label</div>
			</q-card-section>
			<q-card-section class="q-pt-none">
				<q-input dense v-model="editMarkerLabel" autofocus @keyup.enter="editMarker(); editMarkerPrompt = false" label="Label" />
			</q-card-section>
			<q-card-section class="q-pt-none">
				<q-select v-model="editMarkerColor" :options="markerColors" label="Type" />
			</q-card-section>
			<q-card-actions align="right" class="text-primary">
				<q-btn flat label="Cancel" v-close-popup />
				<q-btn flat label="Edit marker" @click="editMarker" v-close-popup />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>