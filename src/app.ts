import "@babylonjs/core/Debug/debugLayer";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";

import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, GroundMesh,PhysicsAggregate,PhysicsShapeType } from "@babylonjs/core";
import { CannonJSPlugin } from '@babylonjs/core/Physics/Plugins/CannonJSPlugin';
import { PhysicsImpostor } from '@babylonjs/core/Physics';
import * as CANNON from 'cannon'; 

window.CANNON = require( 'cannon' );

class App {

    constructor() {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);
        var gravityVector = new Vector3(0,-9.81, 0);
        var physicsPlugin = new CannonJSPlugin();
        scene.enablePhysics(gravityVector, physicsPlugin);

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 4, Math.PI / 6, 20, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        const ground = MeshBuilder.CreateGround("ground", {height: 20, width: 20, subdivisions: 4});
        ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);

        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        SceneLoader.ImportMeshAsync("", "./models/", "CyberAttackerPlacement_4SidedDice.glb", scene)
        .then((result) => {
            result.meshes[0].position.x = 3;
            result.meshes[0].position.y = 3;
            result.meshes[0].physicsImpostor = new PhysicsImpostor(result.meshes[0], PhysicsImpostor.BoxImpostor, { mass: 0.1 }, scene);
            
        });
        SceneLoader.ImportMeshAsync("", "./models/", "CyberAttackerPlacement_4SidedDice.glb", scene)
        .then((result) => {
            result.meshes[0].position.x = -3;
            result.meshes[0].position.y = 3;
            result.meshes[0].physicsImpostor = new PhysicsImpostor(result.meshes[0], PhysicsImpostor.BoxImpostor, { mass: 0.1 }, scene);

        });
        SceneLoader.ImportMeshAsync("", "./models/", "CyberAttackerPlacement_6SidedDice.glb", scene)
        .then((result) => {
            result.meshes[0].position.x = 0;
            result.meshes[0].position.y = 3;
            result.meshes[0].physicsImpostor = new PhysicsImpostor(result.meshes[0], PhysicsImpostor.BoxImpostor, { mass: 0.1 }, scene);
        });

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
new App();