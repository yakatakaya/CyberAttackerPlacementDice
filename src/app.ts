import "@babylonjs/core/Debug/debugLayer";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";

import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, GroundMesh,PhysicsAggregate,PhysicsShapeType,HavokPlugin, TransformNode, ActionManager,ExecuteCodeAction } from "@babylonjs/core";
import { PhysicsImpostor, PhysicsShapeContainer, PhysicsShapeMesh,PhysicsBody, PhysicsMotionType } from '@babylonjs/core/Physics';

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
    static getRandomInt(max) {
        return Math.floor(Math.random() * max);
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
            let root = new TransformNode("root");
            let boxClone2Shape = new PhysicsShapeContainer(scene);
            root.position.set(3, 3, 0);
            var body = new PhysicsBody(root, PhysicsMotionType.DYNAMIC, false, scene);
            
            var applyForce = function (physicsBody : PhysicsBody, obj : TransformNode, vector :Vector3) {
                var point = obj.absolutePosition;
                point.y -= 1;

                physicsBody.applyForce(
                    vector,
                    point
                );
            }

            // Mesh shape
            result.meshes.forEach((mesh)=>{
                mesh.parent = root;
                let phy = new PhysicsShapeMesh(mesh as Mesh, scene);
                boxClone2Shape.addChildFromParent(root, phy, mesh);
                mesh.actionManager = new ActionManager(scene);
                mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
                    applyForce(body, root, new Vector3(App.getRandomInt(100), 1000, App.getRandomInt(100)));
                }));
            });


            body.shape = boxClone2Shape;
            body.setMassProperties ({
                mass: 2,
            });
                    
        });
        SceneLoader.ImportMeshAsync("", "./models/", "CyberAttackerPlacement_4SidedDice.glb", scene)
        .then((result) => {
            let root = new TransformNode("root");
            let boxClone2Shape = new PhysicsShapeContainer(scene);
            root.position.set(-3, 3, 0);
            var body = new PhysicsBody(root, PhysicsMotionType.DYNAMIC, false, scene);

            var applyForce = function (physicsBody : PhysicsBody, obj : TransformNode, vector :Vector3) {
                var point = obj.absolutePosition;
                point.y -= 1;

                physicsBody.applyForce(
                    vector,
                    point
                );
            }

            // Mesh shape
            result.meshes.forEach((mesh)=>{
                mesh.parent = root;
                let phy = new PhysicsShapeMesh(mesh as Mesh, scene);
                boxClone2Shape.addChildFromParent(root, phy, mesh);
                mesh.actionManager = new ActionManager(scene);
                mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
                    applyForce(body, root, new Vector3(App.getRandomInt(100), 1000, App.getRandomInt(100)));
                }));
            });

            body.shape = boxClone2Shape;
            body.setMassProperties ({
                mass: 2,
            });

        });
        SceneLoader.ImportMeshAsync("", "./models/", "CyberAttackerPlacement_6SidedDice.glb", scene)
        .then((result) => {
            let root = new TransformNode("root");
            let boxClone2Shape = new PhysicsShapeContainer(scene);
            root.position.set(0, 3, 0);
            root.scaling.scaleInPlace(0.5);

            var body = new PhysicsBody(root, PhysicsMotionType.DYNAMIC, false, scene);

            var applyForce = function (physicsBody : PhysicsBody, obj : TransformNode, vector :Vector3) {
                var point = obj.absolutePosition;
                point.y -= 1;

                physicsBody.applyForce(
                    vector,
                    point
                );
            }

            // Mesh shape
            result.meshes.forEach((mesh)=>{
                mesh.parent = root;
                let phy = new PhysicsShapeMesh(mesh as Mesh, scene);
                boxClone2Shape.addChildFromParent(root, phy, mesh);
                mesh.actionManager = new ActionManager(scene);
                mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
                    applyForce(body, root, new Vector3(App.getRandomInt(100), 1000, App.getRandomInt(100)));
                }));
            });
            body.shape = boxClone2Shape;
            body.setMassProperties ({
                mass: 2,
            });

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