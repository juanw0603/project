function main() {
    var CANVAS = document.getElementById("myCanvas");


    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    function normalizeX(x) {
        return ((x / CANVAS.width) * 2) - 1;
    }
    function normalizeY(y) {
        return -1 * (((y / CANVAS.height) * 2) - 1);
    }

    function detect(e) {
        console.log("X : " + e.pageX + ", Y: " + e.pageY);
    }


    var drag = false;
    var dX = 0;
    var dY = 0;


    var X_prev = 0;
    var Y_prev = 0;


    var scaleX = 1;
    var scaleY = 1;
    var scaleZ = 1;

    var rotateX = 0;
    var rotateY = 0;
    var rotateZ = 0;
    var translateX = 0;
    var translateY = 0;
    var translateZ = 0;
    
    var scaleXSnoopy = 1;
    var scaleYSnoopy = 1;
    var scaleZSnoopy = 1;

    var rotateXSnoopy = 0;
    var rotateYSnoopy = 0;
    var rotateZSnoopy = 0;
    var translateXSnoopy = 0;
    var translateYSnoopy = 0;
    var translateZSnoopy = 0;

    var FRICTION = 0.02;

    var keys = {};

    var handleKeyDown = function (e) {
        keys[e.key] = true;
    };

    var handleKeyUp = function (e) {
        keys[e.key] = false;
    };

    var handleKeys = function () {
        // control FRED
        if (keys["s"]) {
            rotateX += 0.05;
        }
        if (keys["w"]) {
            rotateX -= 0.05;
        }
        if (keys["d"]) {
            rotateY += 0.05;
        }
        if (keys["a"]) {
            rotateY -= 0.05;
        }
        if (keys["e"]) {
            rotateZ += 0.05;
        }
        if (keys["q"]) {
            rotateZ -= 0.05;
        }
        if (keys["l"]) {
            translateX += 0.05;
        }
        if (keys["j"]) {
            translateX -= 0.05;
        }
        if (keys["i"]) {
            translateY += 0.05;
        }
        if (keys["k"]) {
            translateY -= 0.05;
        }
        if (keys["o"]) {
            translateZ += 0.05;
        }
        if (keys["p"]) {
            translateZ -= 0.05;
        }
        if (keys["m"]) {
            scaleX += 0.01;
            scaleY += 0.01;
            scaleZ += 0.01;
        }
        if (keys["n"]) {
            scaleX -= 0.01;
            scaleY -= 0.01;
            scaleZ -= 0.01;
        }
        //control JAVIER
        if (keys["g"]) {
            rotateXSnoopy += 0.05;
        }
        if (keys["t"]) {
            rotateXSnoopy -= 0.05;
        }
        if (keys["h"]) {
            rotateYSnoopy += 0.05;
        }
        if (keys["f"]) {
            rotateYSnoopy -= 0.05;
        }
        if (keys["y"]) {
            rotateZSnoopy += 0.05;
        }
        if (keys["r"]) {
            rotateZSnoopy -= 0.05;
        }
        if (keys["6"]) {
            translateXSnoopy += 0.05;
        }
        if (keys["4"]) {
            translateXSnoopy -= 0.05;
        }
        if (keys["8"]) {
            translateYSnoopy += 0.05;
        }
        if (keys["5"]) {
            translateYSnoopy -= 0.05;
        }
        if (keys["7"]) {
            translateZSnoopy += 0.05;
        }
        if (keys["9"]) {
            translateZSnoopy -= 0.05;
        }
        if (keys["z"]) {
            scaleXSnoopy += 0.01;
            scaleYSnoopy += 0.01;
            scaleZSnoopy += 0.01;
        }
        if (keys["x"]) {
            scaleXSnoopy -= 0.01;
            scaleYSnoopy -= 0.01;
            scaleZSnoopy -= 0.01;
        }
    };

    document.addEventListener("keydown", handleKeyDown, false);
    document.addEventListener("keyup", handleKeyUp, false);


    var mouseDown = function (e) {
        drag = true;
        X_prev = e.pageX;
        Y_prev = e.pageY;
    }


    var mouseUp = function (e) {
        drag = false;
    }

    // var shader_vertex = compile_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
    // var shader_fragment = compile_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

    // var SHADER_PROGRAM = GL.createProgram();
    // GL.attachShader(SHADER_PROGRAM, shader_vertex);
    // GL.attachShader(SHADER_PROGRAM, shader_fragment);



    // GL.linkProgram(SHADER_PROGRAM);


    // var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
    // var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");


    // //uniform
    // var _PMatrix = GL.getUniformLocation(SHADER_PROGRAM, "PMatrix"); //projection
    // var _VMatrix = GL.getUniformLocation(SHADER_PROGRAM, "VMatrix"); //View
    // var _MMatrix = GL.getUniformLocation(SHADER_PROGRAM, "MMatrix"); //Model


    // GL.enableVertexAttribArray(_color);
    // GL.enableVertexAttribArray(_position);

    // GL.useProgram(SHADER_PROGRAM);



    try {
        GL = CANVAS.getContext("webgl", { antialias: true });
    } catch (e) {
        alert("WebGL context cannot be initialized");
        return false;
    }
    //shaders
    var shader_vertex_source = `
      attribute vec3 position;
      attribute vec3 color;


      uniform mat4 PMatrix;
      uniform mat4 VMatrix;
      uniform mat4 MMatrix;
     
      varying vec3 vColor;
      void main(void) {
      gl_Position = PMatrix*VMatrix*MMatrix*vec4(position, 1.);
      vColor = color;


      gl_PointSize=60.0;
      }`;
    var shader_fragment_source = `
      precision mediump float;
      varying vec3 vColor;
      // uniform vec3 color;


      uniform float greyScality;


      void main(void) {
      float greyScaleValue = (vColor.r + vColor.g + vColor.b)/3.;
      vec3 greyScaleColor = vec3(greyScaleValue, greyScaleValue, greyScaleValue);
      vec3 color = mix(greyScaleColor, vColor, greyScality);
      gl_FragColor = vec4(color, 1.);
      }`;

    //matrix
    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEW_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX2 = LIBS.get_I4();
    var MODEL_MATRIX3 = LIBS.get_I4();
    var MODEL_MATRIX4 = LIBS.get_I4();
    var MODEL_MATRIX5 = LIBS.get_I4();
    var MODEL_MATRIX6 = LIBS.get_I4();


    LIBS.translateZ(VIEW_MATRIX, -70);

    //-----------------------------------------------------Stewie-----------------------------------------


    var overall = new MyObject(Elips(0, 0, 0, 5, 3, 3, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(0, 0, 0, 2, 2, 2, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    overall.setup();
    var body = new MyObject(verticallyCylinderVertex(0, -6, 0, 3, 2, 4, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765), verticallyCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    body.setup();
    var diaper = new MyObject(Elips(0, -6, 0, 3, 2.5, 2, 100, 100, 1, 1, 1).vertex, Elips(0, -8, 5, 3, 2, 4, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    diaper.setup();
    var rightLeg = new MyObject(verticallyCylinderVertex(1.2, -10.5, 0, 1, 1, 4, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765), verticallyCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    rightLeg.setup();
    var leftLeg = new MyObject(verticallyCylinderVertex(-1.2, -10.5, 0, 1, 1, 4, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765), verticallyCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    leftLeg.setup();
    var leftArm = new MyObject(horizontalCylinderVertex(2.7, -3.7, 0, 0.75, 3, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765), horizontalCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    leftArm.setup();
    var rightArm = new MyObject(horizontalCylinderVertex(-2.7, -3.7, 0, 0.75, -3, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765), horizontalCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    rightArm.setup();
    var leftHand = new MyObject(Elips(-5.8, -3.7, 0, 1.23, 0.75, 0.7, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    leftHand.setup();
    var rightHand = new MyObject(Elips(5.8, -3.7, 0, 1.23, 0.75, 0.7, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    rightHand.setup();
    var leftToe = new MyObject(Elips(-1.2, -10.5, 0.5, 1, 0.5, 1.5, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    leftToe.setup();
    var rightToe = new MyObject(Elips(1.2, -10.5, 0.5, 1, 0.5, 1.5, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    rightToe.setup();
    var leftFinger1 = new MyObject(Elips(-6, -2.7, 0, 0.4, 0.7, 0.3, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    leftFinger1.setup();
    var leftFinger2 = new MyObject(Elips(-7, -3.3, 0, 0.7, 0.3, 0.3, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    leftFinger2.setup();
    var leftFinger3 = new MyObject(Elips(-7, -4, 0, 0.7, 0.3, 0.3, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    leftFinger3.setup();
    var rightFinger1 = new MyObject(Elips(6, -2.7, 0, 0.4, 0.7, 0.3, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    rightFinger1.setup();
    var rightFinger2 = new MyObject(Elips(7, -3.3, 0, 0.7, 0.3, 0.3, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    rightFinger2.setup();
    var rightFinger3 = new MyObject(Elips(7, -4, 0, 0.7, 0.3, 0.3, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    rightFinger3.setup();
    var leftEye = new MyObject(Elips(-1.3, 0.3, 2.6, 1, 1, 1, 100, 100, 1, 1, 1).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    leftEye.setup();
    var rightEye = new MyObject(Elips(1.3, 0.3, 2.6, 1, 1, 1, 100, 100, 1, 1, 1).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    rightEye.setup();
    var leftPupil = new MyObject(Elips(-1.3, 0.3, 3.5, 0.2, 0.2, 0.2, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    leftPupil.setup();
    var rightPupil = new MyObject(Elips(1.3, 0.3, 3.5, 0.2, 0.2, 0.2, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    rightPupil.setup();
    var leftEyebrow = new MyObject(generateEyebrowVertices(-2.3, 1.4, 2.7, 2, 1, 0.1, 0, 0, 0), generateEyebrowIndexes(), shader_vertex_source, shader_fragment_source);
    leftEyebrow.setup();
    var rightEyebrow = new MyObject(generateEyebrowVertices(2.3, 1.4, 2.7, -2, 1, 0.1, 0, 0, 0), generateEyebrowIndexes(), shader_vertex_source, shader_fragment_source);
    rightEyebrow.setup();
    var mouth = new MyObject(Elips(0, -1.5, 2.5, 0.2, 0.2, 0.2, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    mouth.setup();
    var leftEar = new MyObject(Elips(-5, 0, 0, 0.5, 0.5, 0.2, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    leftEar.setup();
    var rightEar = new MyObject(Elips(5, 0, 0, 0.5, 0.5, 0.2, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    rightEar.setup();
    var hair1 = new MyObject(Elips(0, 1.3, 0, 0.1, 2, 2.1, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hair1.setup();
    var hair2 = new MyObject(Elips(1, 1.3, 0, 0.1, 2, 2.1, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hair2.setup();
    var hair3 = new MyObject(Elips(2, 1.1, 0, 0.1, 2, 2.1, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hair3.setup();
    var hair4 = new MyObject(Elips(3, 0.6, 0, 0.1, 2, 2.1, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hair4.setup();
    var hair5 = new MyObject(Elips(4, 0.3, 0, 0.1, 2, 1.6, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hair5.setup();
    var hair6 = new MyObject(Elips(-1, 1.3, 0, 0.1, 2, 2.1, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hair6.setup();
    var hair7 = new MyObject(Elips(-2, 1.1, 0, 0.1, 2, 2.1, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hair7.setup();
    var hair8 = new MyObject(Elips(-3, 0.6, 0, 0.1, 2, 2.1, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hair8.setup();
    var hair9 = new MyObject(Elips(-4, 0.3, 0, 0.1, 2, 1.6, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hair9.setup();
    var kumis = new MyObject(Kumis([
        -1, -1.1, 3, 0, 0, 0,
        0, -0.2,  3, 0, 0, 0,
        1, -1.1,  3, 0, 0, 0
    ], 0.1).vertices, Kumis([
        -1, -1.1, 4, 0, 0, 0,
        0, -0.2, 4, 0, 0, 0,
        1, -1.1, 4, 0, 0, 0
    ], 0.1).indices, shader_vertex_source, shader_fragment_source);
    kumis.setup();


    overall.child.push(body);
    overall.child.push(diaper);
    overall.child.push(rightLeg);
    overall.child.push(leftLeg);
    overall.child.push(leftArm);
    overall.child.push(rightArm);
    overall.child.push(leftHand);
    overall.child.push(rightHand);
    overall.child.push(leftToe);
    overall.child.push(rightToe);
    overall.child.push(leftFinger1);
    overall.child.push(leftFinger2);
    overall.child.push(leftFinger3);
    overall.child.push(rightFinger1);
    overall.child.push(rightFinger2);
    overall.child.push(rightFinger3);
    overall.child.push(leftEye);
    overall.child.push(rightEye);
    overall.child.push(leftPupil);
    overall.child.push(rightPupil);
    overall.child.push(leftEyebrow);
    overall.child.push(rightEyebrow);
    overall.child.push(mouth);
    overall.child.push(leftEar);
    overall.child.push(rightEar);
    overall.child.push(hair1);
    overall.child.push(hair2);
    overall.child.push(hair3);
    overall.child.push(hair4);
    overall.child.push(hair5);
    overall.child.push(hair6);
    overall.child.push(hair7);
    overall.child.push(hair8);
    overall.child.push(hair9);
    overall.child.push(kumis);
    
    //----------------------------------------Snoopy-----------------------------------------------
    
    var snoopyKepala = new MyObject(Elips(0, 0, 0, 6, 8, 5, 100, 100, 1, 1, 1).vertex, Elips(0, 0, 0, 3, 3, 3, 100, 100, 1, 1, 1).indexes, shader_vertex_source, shader_fragment_source);
    snoopyKepala.setup();
    var snoopyBadan = new MyObject(verticallyCylinderVertex(0, -4.5, 0, 5, 4, -9, 1, 1, 1), verticallyCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    snoopyBadan.setup();
    var moncong = new MyObject(Elips(0, -1, 5, 5, 4, 5, 100, 100, 1, 1, 1).vertex, Elips(0, -2, 0, 2, 1, 3, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    moncong.setup();
    var hidung = new MyObject(Elips(0, -1.5, 10, 2, 1.5, 1.5, 100, 100, 0, 0, 0).vertex, Elips(0, -2, 0, 2, 1, 3, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hidung.setup();
    var mata_hitam_belakang_kiri = new MyObject(Elips(1.5, 4.5, 4, 1, 1.5, 0.8, 100, 100, 0, 0, 0).vertex, Elips(0, -2, 0, 2, 1, 3, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    mata_hitam_belakang_kiri.setup();
    var mata_hitam_belakang_kanan = new MyObject(Elips(-1.5, 4.5, 4, 1, 1.5, 0.8, 100, 100, 0, 0, 0).vertex, Elips(0, -2, 0, 2, 1, 3, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    mata_hitam_belakang_kanan.setup();

    var mata_putih_kiri = new MyObject(Elips(-1.5, 4.5, 4.5, 0.7, 1, 0.5, 100, 100, 1, 1, 1).vertex, Elips(0, -2, 0, 2, 1, 3, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    mata_putih_kiri.setup();
    var mata_putih_kanan = new MyObject(Elips(1.5, 4.5, 4.5, 0.7, 1, 0.5, 100, 100, 1, 1, 1).vertex, Elips(0, -2, 0, 2, 1, 3, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    mata_putih_kanan.setup();

    var pupil_kiri = new MyObject(Elips(-1.5, 4.5, 5, 0.2, 0.2, 0.2, 100, 100, 0, 0, 0).vertex, Elips(0, -2, 0, 2, 1, 3, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    pupil_kiri.setup();
    var pupil_kanan = new MyObject(Elips(1.5, 4.5, 5, 0.2, 0.2, 0.2, 100, 100, 0, 0, 0).vertex, Elips(0, -2, 0, 2, 1, 3, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    pupil_kanan.setup();
    
    var kaki_kiri = new MyObject(verticallyCylinderVertex(-2,-13.5, 0, 2.5, 3, -6, 1, 1, 1), verticallyCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    kaki_kiri.setup();
    var kaki_kanan = new MyObject(verticallyCylinderVertex(2,-13.5, 0, 2.5, 3, -6, 1, 1, 1), verticallyCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    kaki_kanan.setup();

    var kalung = new MyObject(verticallyCylinderVertex(0,-6, 0, 5.2, 4.2, 1, 1, 0, 0), verticallyCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    kalung.setup();

    var tangan_kiri = new MyObject(Elips(-5.5, -11, 0, 1.5, 6, 2, 100, 100, 1, 1, 1).vertex, Elips(-3, 0, 4, 1, 4, 2, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    tangan_kiri.setup();
    
    var tangan_kanan = new MyObject(Elips(5.5, -11, 0, 1.5, 6, 2, 100, 100, 1, 1, 1).vertex, Elips(-3, 0, 4, 1, 4, 2, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    tangan_kanan.setup();
    
    var sepatu_kiri = new MyObject(Elips(-2, -20, 1, 3, 1.5, 4, 100, 100, 1, 1, 1).vertex, Elips(-3, 0, 4, 1, 4, 2, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    sepatu_kiri.setup();
    var sepatu_kanan = new MyObject(Elips(2, -20, 1, 3, 1.5, 4, 100, 100, 1, 1, 1).vertex, Elips(-3, 0, 4, 1, 4, 2, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    sepatu_kanan.setup();

    var telinga_kiri = new MyObject(Elips(-5.6, 6, 0, 3, 1, 1.5, 100, 100, 1, 1, 1).vertex, Elips(-3, 0, 4, 1, 4, 2, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    telinga_kiri.setup();
    var telinga_kanan = new MyObject(Elips(5.6, 6, 0, 3, 1, 1.5, 100, 100, 1, 1, 1).vertex, Elips(-3, 0, 4, 1, 4, 2, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    telinga_kanan.setup();

    kumis_koordinat = [
        -3, -3, 8.5, 0, 0, 0,
        0, -5, 8.5, 0, 0, 0,
        3, -3, 8.5, 0, 0, 0  
    ];

    var mulut = new MyObject(Kumis(kumis_koordinat, 0.2).vertices, Kumis(kumis_koordinat, 0.2).indices, shader_vertex_source, shader_fragment_source);
    mulut.setup();

    var lonceng = new MyObject(Elips(0, -6.6, 4, 0.8, 0.8, 0.8, 100, 100, 0.937, 0.71, 0.286).vertex, Elips(0, -5, 3, 0.5, 0.5, 0.5, 100, 100, 1, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    lonceng.setup();
    
    overall.child.push(snoopyKepala);
    overall.child.push(snoopyBadan);
    overall.child.push(moncong);
    overall.child.push(hidung);
    overall.child.push(mata_hitam_belakang_kiri);
    overall.child.push(mata_hitam_belakang_kanan);
    overall.child.push(mata_putih_kiri);
    overall.child.push(mata_putih_kanan);
    overall.child.push(pupil_kiri);
    overall.child.push(pupil_kanan);
    overall.child.push(kaki_kiri);
    overall.child.push(kaki_kanan);
    overall.child.push(kalung);
    overall.child.push(tangan_kiri);
    overall.child.push(tangan_kanan);
    overall.child.push(sepatu_kiri);
    overall.child.push(sepatu_kanan);
    overall.child.push(telinga_kiri);
    overall.child.push(telinga_kanan);
    overall.child.push(mulut);
    // console.log(lonceng);
    overall.child.push(lonceng);



    GL.clearColor(0, 0, 1, 1);


    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);

    var time_prev = 0;
    var animate = function (time) {
        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.D_BUFFER_BIT);
        var dt = time - time_prev;
        time_prev = time;

        MODEL_MATRIX = LIBS.get_I4();
        LIBS.rotateX(MODEL_MATRIX, rotateX);
        LIBS.rotateY(MODEL_MATRIX, rotateY);
        LIBS.rotateZ(MODEL_MATRIX, rotateZ);
        LIBS.translateX(MODEL_MATRIX, translateX-20);
        LIBS.translateY(MODEL_MATRIX, translateY);
        LIBS.translateZ(MODEL_MATRIX, translateZ);
        // LIBS.setPosition(MODEL_MATRIX, 0, 0, 0);
        LIBS.scale(MODEL_MATRIX, scaleX, scaleY, scaleZ);

        var MODEL_MATRIX2 = LIBS.get_I4();
        // LIBS.rotateX(MODEL_MATRIX2, 5);
        // LIBS.rotateY(MODEL_MATRIX2, 2);
        // LIBS.rotateZ(MODEL_MATRIX2, 1);
        // LIBS.translateX(MODEL_MATRIX2, -20);
        // LIBS.translateY(MODEL_MATRIX2, 3);
        // LIBS.translateZ(MODEL_MATRIX2, 3);

       

        overall.MODEL_MATRIX = MODEL_MATRIX;
        body.MODEL_MATRIX = MODEL_MATRIX;
        diaper.MODEL_MATRIX = MODEL_MATRIX;
        rightLeg.MODEL_MATRIX = MODEL_MATRIX;
        leftLeg.MODEL_MATRIX = MODEL_MATRIX;
        leftArm.MODEL_MATRIX = MODEL_MATRIX;
        rightArm.MODEL_MATRIX = MODEL_MATRIX;
        leftHand.MODEL_MATRIX = MODEL_MATRIX;
        rightHand.MODEL_MATRIX = MODEL_MATRIX;
        leftToe.MODEL_MATRIX = MODEL_MATRIX;
        rightToe.MODEL_MATRIX = MODEL_MATRIX;
        leftFinger1.MODEL_MATRIX = MODEL_MATRIX;
        leftFinger2.MODEL_MATRIX = MODEL_MATRIX;
        leftFinger3.MODEL_MATRIX = MODEL_MATRIX;
        rightFinger1.MODEL_MATRIX = MODEL_MATRIX;
        rightFinger2.MODEL_MATRIX = MODEL_MATRIX;
        rightFinger3.MODEL_MATRIX = MODEL_MATRIX;
        leftEye.MODEL_MATRIX = MODEL_MATRIX;
        rightEye.MODEL_MATRIX = MODEL_MATRIX;
        leftPupil.MODEL_MATRIX = MODEL_MATRIX;
        rightPupil.MODEL_MATRIX = MODEL_MATRIX;
        leftEyebrow.MODEL_MATRIX = MODEL_MATRIX;
        rightEyebrow.MODEL_MATRIX = MODEL_MATRIX;
        mouth.MODEL_MATRIX = MODEL_MATRIX;
        leftEar.MODEL_MATRIX = MODEL_MATRIX;
        rightEar.MODEL_MATRIX = MODEL_MATRIX;
        hair1.MODEL_MATRIX = MODEL_MATRIX;
        hair2.MODEL_MATRIX = MODEL_MATRIX;
        hair3.MODEL_MATRIX = MODEL_MATRIX;
        hair4.MODEL_MATRIX = MODEL_MATRIX;
        hair5.MODEL_MATRIX = MODEL_MATRIX;
        hair6.MODEL_MATRIX = MODEL_MATRIX;
        hair7.MODEL_MATRIX = MODEL_MATRIX;
        hair8.MODEL_MATRIX = MODEL_MATRIX;
        hair9.MODEL_MATRIX = MODEL_MATRIX;
        kumis.MODEL_MATRIX = MODEL_MATRIX;

        var SNOOPY_MODEL_MATRIX = LIBS.get_I4();
        LIBS.rotateX(SNOOPY_MODEL_MATRIX, rotateXSnoopy);
        LIBS.rotateY(SNOOPY_MODEL_MATRIX, rotateYSnoopy);
        LIBS.rotateZ(SNOOPY_MODEL_MATRIX, rotateZSnoopy);
        LIBS.translateX(SNOOPY_MODEL_MATRIX, translateXSnoopy);
        LIBS.translateY(SNOOPY_MODEL_MATRIX, translateYSnoopy+10);
        LIBS.translateZ(SNOOPY_MODEL_MATRIX, translateZSnoopy);
        // LIBS.setPosition(SNOOPY_MODEL_MATRIX, 0, 0, 0);
        // LIBS.scalling(SNOOPY_MODEL_MATRIX, scaleXSnoopy, scaleYSnoopy, scaleZSnoopy);

        snoopyKepala.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        snoopyBadan.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        moncong.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        hidung.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        mata_hitam_belakang_kiri.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        mata_hitam_belakang_kanan.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        mata_putih_kiri.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        mata_putih_kanan.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        pupil_kiri.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        pupil_kanan.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        kaki_kiri.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        kaki_kanan.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        kalung.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        tangan_kiri.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        tangan_kanan.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        kaki_kiri.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        kaki_kanan.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        sepatu_kiri.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        sepatu_kanan.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        telinga_kiri.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        telinga_kanan.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        mulut.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;
        lonceng.MODEL_MATRIX = SNOOPY_MODEL_MATRIX;

        overall.render(VIEW_MATRIX, PROJECTION_MATRIX);

        handleKeys();

        window.requestAnimationFrame(animate);
    };
    animate(0);
}
window.addEventListener('load', main);