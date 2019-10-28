import React from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Interaction } from 'three.interaction';
// import DragControls from 'three-dragcontrols'

class MeshWithParams extends THREE.Mesh {

    constructor(params, ...args){
        super(...args)
        this.params = { ...params }
    }
}

export default class {

    constructor(){

        this.markers = []
    }

    init({ markers, canvasRef, clickHandler }){
  
        this.handleClick = clickHandler 

        const renderer = new THREE.WebGLRenderer({
            antialias : true
        });
        this.renderer = renderer

        const width = window.innerWidth
        const height = window.innerHeight - (16 * 4)

        renderer.setSize( width, height );
        renderer.domElement.globalCompositeOperation = 'destination-over'

        canvasRef.appendChild(renderer.domElement);
        renderer.shadowMap.enabled = true
        
        const updateFcts = [];
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 100 );
        this.camera.position.z = 4;
    
        const light = new THREE.AmbientLight( 0x888888 )
        this.scene.add( light )
    
        this.scene.add( this.getDirectionalLight() )
        
        // added starfield
        const starSphere = this.getStarfield()
        this.scene.add(starSphere)
    
        // comment
        const mars = this.getMars()
        this.scene.add(mars)
    
        // Camera Controls
        const controls = new OrbitControls( this.camera, renderer.domElement );
        this.controls = controls
        //controls.update() must be called after any manual changes to the camera's transform
        // camera.position.set( 0, 20, 100 );
        controls.update();
        controls.enableZoom = true;
        controls.zoomSpeed = 0.2;

        // enable events 
        const interaction = new Interaction(renderer, this.scene, this.camera);

        // render the scene
        updateFcts.push(() => {
            renderer.render( this.scene, this.camera );  
        })

        this.addMarkers(markers)

        this.handleResize()
        
        // loop runner
        let lastTimeMsec= null
        requestAnimationFrame(function animate(nowMsec){
            // keep looping 
            requestAnimationFrame( animate );

            // set camera position
            controls.update();

            // measure time
            lastTimeMsec = lastTimeMsec || nowMsec-1000/60
            const deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
            lastTimeMsec = nowMsec
            // call each update function
            updateFcts.forEach(function(updateFn){
                updateFn(deltaMsec/1000, nowMsec/1000)
            })
        })
    }

    handleResize = () => {
        window.addEventListener('resize', () => {

            const width = window.innerWidth
            const height = window.innerHeight - (16 * 4)

            this.camera.aspect = width / height
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(width, height);

        }, false);
 
    }


    enableCamera = () => this.controls.enabled = true

    disableCamera = () => this.controls.enabled = false 
 
    addMarkers = (list = []) => {
        
        const objects = []
        for(let i = 0; i < list.length; i++){
            const d = list[i] 
            this.addMarker(d) 
        }
        return objects
    }

    addMarker = data => {
        const adjustedMarker = this.buildMarker(data)
        this.markers.push(adjustedMarker)
        this.scene.add(adjustedMarker)
    }

    buildMarker = ({ id, title, color, latitude, longitude  }) => {
         
        const geometry = new THREE.BoxGeometry(0.08, 0.04, .001)
        // tesla.png
        // const material = new THREE.MeshBasicMaterial({color: 'white', wireframe: false})
        const texture = THREE.ImageUtils.loadTexture('/static/tesla-min.png')
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            color,
        })

        const params = { id, title, color, latitude, longitude }
        
        const box = new MeshWithParams(params, geometry, material); 
        box.geometry.translate(0, 0, 0.025 + 1);
        box.rotation.x = Math.PI * 2 * latitude
        box.rotation.y = Math.PI * 2 * longitude

        box.on(`click`, e => this.handleClick(id))

        return box  
    }

    updateMarker = data => {
        const {
            id,
            color,
            title, 
            latitude, 
            longitude
        } = data 

        const currentMarker = this.markers.find(m => m.params.id === id)  
        if(!currentMarker)
            return 
        
        if(color)
            currentMarker.material.color.setHex(color);
        if(latitude || latitude === 0)
            currentMarker.rotation.x = Math.PI * 2 * latitude
        if(longitude || longitude === 0)
            currentMarker.rotation.y = Math.PI * 2 * longitude

        if(title)
            currentMarker.params.title = title
        if(latitude)
            currentMarker.params.latitude = latitude
        if(longitude)
            currentMarker.params.longitude = longitude
        if(color)
            currentMarker.params.color = color
    }

    removeMarker = data => {
     
        const index = this.markers.findIndex(m => m.params.id === data.id)
        const adjustedMarker = this.markers[index]
        this.markers.splice(index, 1)

        this.scene.remove(adjustedMarker)
    }

    findMarker = fn => {
        return this.markers.find(fn)
    }

    getStarfield = function(){
        const texture = THREE.ImageUtils.loadTexture(`static/galaxy_starfield.png`)
        const material = new THREE.MeshBasicMaterial({
            map : texture,
            side : THREE.BackSide
        })
        const geometry = new THREE.SphereGeometry(100, 32, 32)
        const mesh = new THREE.Mesh(geometry, material)
        return mesh 
    }

    getMars = () => {
        const geometry = new THREE.SphereGeometry(1, 32, 32)
        const material = new THREE.MeshPhongMaterial({
            map : THREE.ImageUtils.loadTexture(`static/${process.env.NODE_ENV === 'development' ? 'marsmap1k.jpg' : 'marsmap1k-hd.jpg'}`),
            bumpMap : THREE.ImageUtils.loadTexture(`static/marsbump1k.jpg`),
            bumpScale: 0.05,
        })
        const mesh = new THREE.Mesh(geometry, material)
        return mesh 
    }

    getDirectionalLight = () => {
        
        const light = new THREE.DirectionalLight( 0xcccccc, 1 )
        light.position.set(5,5,5)
        light.castShadow = true
        light.shadow.cameraNear = 0.01
        light.shadow.cameraFar = 15
        light.shadow.cameraFov = 45
    
        light.shadow.cameraLeft = -1
        light.shadow.cameraRight =  1
        light.shadow.cameraTop =  1
        light.shadow.cameraBottom= -1
        // light.shadowCameraVisible = true
    
        light.shadow.bias = 0.001
        light.shadow.darkness = 0.2
    
        light.shadow.mapWidth = 1024*2
        light.shadow.mapHeight = 1024*2
        
        return light
    }

}
