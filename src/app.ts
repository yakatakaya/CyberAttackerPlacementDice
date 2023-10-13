import "@babylonjs/core/Debug/debugLayer";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";

import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, GroundMesh,PhysicsAggregate,PhysicsShapeType,HavokPlugin } from "@babylonjs/core";
import { PhysicsImpostor, PhysicsShapeContainer } from '@babylonjs/core/Physics';

import HavokPhysics, { HavokPhysicsWithBindings } from "@babylonjs/havok";


async function getInitializedHavok() {
  return await HavokPhysics();
}

class App {
    static async build(){
        
        var havok = await Promise.resolve(getInitializedHavok());
        const app = new App(havok);
        return 
    }
    constructor(havok : HavokPhysicsWithBindings) {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);
        scene.enablePhysics(new Vector3(0, -9.81, 0), new HavokPlugin(true, havok));

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 4, Math.PI / 6, 20, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        const ground = MeshBuilder.CreateGround("ground", {height: 20, width: 20, subdivisions: 4});
        new PhysicsAggregate(ground, PhysicsShapeType.BOX, {mass: 0, friction: 0.7, restitution: 0.8}, scene);

        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        SceneLoader.ImportMeshAsync("", "./models/", "CyberAttackerPlacement_4SidedDice.glb", scene)
        .then((result) => {
            var root = new Mesh("dice1", scene);

            result.meshes.forEach((m, i)=>{
                if(m.name.indexOf("box") != -1){
                    m.isVisible = false
                    root.addChild(m)
                }
            })
        
            // Add all root nodes within the loaded gltf to the physics root
            result.meshes.forEach((m, i)=>{
                if(m.parent == null){
                    root.addChild(m)
                }
            })
        
            // Make every collider into a physics impostor
            root.getChildMeshes().forEach((m)=>{
                if(m.name.indexOf("box") != -1){
                    m.position.x = -3;
                    m.position.y = 30;
        
                    new PhysicsAggregate(m, PhysicsShapeType.BOX, { mass: 0.1 }, scene);
                }
            })
            
            // Scale the root object and turn it into a physics impsotor
            root.position.y = 10;
            new PhysicsAggregate(root, new PhysicsShapeContainer(scene), { mass: 3 }, scene);
            
        });
        SceneLoader.ImportMeshAsync("", "./models/", "CyberAttackerPlacement_4SidedDice.glb", scene)
        .then((result) => {
            result.meshes[0].position.x = -3;
            result.meshes[0].position.y = 3;

        });
        SceneLoader.ImportMeshAsync("", "./models/", "CyberAttackerPlacement_6SidedDice.glb", scene)
        .then((result) => {
            result.meshes[0].position.x = 0;
            result.meshes[0].position.y = 3;
        });
        //var sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
        //sphere.position.y = 4;
        //var sphereAggregate = new PhysicsAggregate(sphere, PhysicsShapeType.SPHERE, { mass: 1, restitution:0.75}, scene);
        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'i') {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });
        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }
}
App.build();