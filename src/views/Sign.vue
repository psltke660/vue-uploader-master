<template>
  <div class="signature" @touchmove.prevent>
    <!-- 防止页面滚动  -->
    <div class="boardBox" ref="boardBox">
      <canvas
        ref="board"
        id="canvas"
        @touchstart="mStart"
        @touchmove="mMove"
        @touchend="mEnd"
      ></canvas>
    </div>
    <div class="bar">
      <div class="item" @click="goback">
        <div class="ico">
          <img src="@/assets/img/guanji.svg" />
        </div>
        <div class="text">退出</div>
      </div>
      <div class="item" @click="clearcanvas">
        <div class="ico">
          <img src="@/assets/img/shuaxin.svg" />
        </div>
        <div class="text">重绘</div>
      </div>
      <div class="item" @click="getcanvas">
        <div class="ico">
          <img src="@/assets/img/tijiao.svg" />
        </div>
        <div class="text">完成</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      familysignatureurl: "",
      basedata: "",
      ctx: null,
      point: {
        x: 0,
        y: 0,
      },
      moving: false, // 是否正在绘制中且移动
    };
  },
  mounted() {
    let board = this.$refs.board; // 获取DOM
    board.width = this.$refs.boardBox.offsetWidth; // 设置画布宽
    board.height = this.$refs.boardBox.offsetHeight; // 设置画布高
    this.ctx = board.getContext("2d"); // 二维绘图
    this.ctx.strokeStyle = "#000"; // 颜色
    this.ctx.lineWidth = 3; // 线条宽度
  },
  methods: {
    // 触摸(开始)
    mStart(e) {
      let x = e.touches[0].clientX - e.target.offsetLeft,
        y = e.touches[0].clientY - e.target.offsetTop; // 获取触摸点在画板（canvas）的坐标
      this.point.x = x;
      this.point.y = y;
      this.ctx.beginPath();
      this.moving = true;
    },
    // 滑动中...
    mMove(e) {
      if (this.moving) {
        let x = e.touches[0].clientX - e.target.offsetLeft,
          y = e.touches[0].clientY - e.target.offsetTop; // 获取触摸点在画板（canvas）的坐标
        this.ctx.moveTo(this.point.x, this.point.y); // 把路径移动到画布中的指定点，不创建线条(起始点)
        this.ctx.lineTo(x, y); // 添加一个新点，然后创建从该点到画布中最后指定点的线条，不创建线条
        this.ctx.stroke(); // 绘制
        (this.point.x = x), (this.point.y = y); // 重置点坐标为上一个坐标
      }
    },
    // 滑动结束
    mEnd() {
      if (this.moving) {
        this.ctx.closePath(); // 停止绘制
        this.moving = false; // 关闭绘制开关
      }
    },
    getcanvas() {
      //绘画转图片
      document.getElementById("canvas").toDataURL("image/png");
      document.getElementById("canvas").toBlob(async (blobObj) => {
        var file1 = new File([blobObj], "pic.png", {
          type: blobObj.type,
          lastModified: Date.now(),
        });
        this.convertImg(file1);
      });
    },
    //转图片
    convertImg(file) {
      let _this = this;
      var canvas1 = document.createElement("canvas");
      var context1 = canvas1.getContext("2d");
      var oReader = new FileReader();
      oReader.readAsDataURL(file);
      oReader.onload = function (e) {
        var img = new Image();
        img.src = e.target.result;
        img.onload = function () {
          // 图片原始尺寸
          var originWidth = this.width;
          var originHeight = this.height;
          // 最大尺寸限制
          var maxWidth = 1080,
            maxHeight = 1080;
          // 目标尺寸
          var targetWidth = originWidth,
            targetHeight = originHeight;
          // 图片尺寸超过300x300的限制
          if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > maxWidth / maxHeight) {
              targetWidth = maxWidth;
              targetHeight = Math.round(
                maxWidth * (originHeight / originWidth)
              );
            } else {
              targetHeight = maxHeight;
              targetWidth = Math.round(
                maxHeight * (originWidth / originHeight)
              );
            }
          }
          var type = "image/jpeg";
          // canvas对图片进行缩放
          canvas1.width = targetHeight;
          canvas1.height = targetWidth;
          // 旋转90度
          context1.translate(0, 0);
          context1.rotate(Math.PI / 2);
          // (0,-imgHeight) 从旋转原理图那里获得的起始点
          // context.clearRect(0,  -targetHeight, targetWidth, targetHeight);
          context1.drawImage(img, 0, -targetHeight, targetWidth, targetHeight);
          // 将canvas的透明背景设置成白色
          var imageData = context1.getImageData(
            0,
            0,
            canvas1.width,
            canvas1.height
          );
          for (var i = 0; i < imageData.data.length; i += 4) {
            // 当该像素是透明的，则设置成白色
            if (imageData.data[i + 3] == 0) {
              imageData.data[i] = 255;
              imageData.data[i + 1] = 255;
              imageData.data[i + 2] = 255;
              imageData.data[i + 3] = 255;
            }
          }
          context1.putImageData(imageData, 0, 0);
          var dataurl = canvas1.toDataURL(type);
          _this.basedata = dataurl;
          console.log(dataurl);
          // 上传服务端
          _this.updatavue();
        };
      };
    },
    //base64转Blob
    base64ToBlob(base64Data) {
      let arr = base64Data.split(","),
        fileType = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        l = bstr.length,
        u8Arr = new Uint8Array(l);

      while (l--) {
        u8Arr[l] = bstr.charCodeAt(l);
      }
      return new Blob([u8Arr], {
        type: fileType,
      });
    },
    //上传图片
    async updatavue() {
      console.log("点击完成 :>> ");
      /*//转成file文件
      let blobObj = this.base64ToBlob(this.basedata);
      var file = new File([blobObj], "pic.png", {
        type: blobObj.type,
        lastModified: Date.now(),
      });
      //此处为发送请求给后台获取图片路径
      let res = await upload(file);
      this.familysignatureurl = res.details.data.filePath;
      console.log(this.familysignatureurl); //此处打印的为绘画的图片url*/
    },
    //清除画布
    clearcanvas() {
      var c = document.getElementById("canvas");
      var cxt = c.getContext("2d");
      c.height = c.height;
      this.ctx.lineWidth = 3;
    },
    //返回上一级
    goback() {
      this.$emit("setshow");
    },
  },
};
</script>

<style lang="less" scoped>
.loadingtext {
  transform: rotate(-90deg);
  color: red;
}
.item {
  -webkit-transform: rotate(-90deg);
}

.text {
  text-align: center;
}

.boardBox {
  width: 100vw;
  height: 90vh;
  background: #f9f9f9;
}

.bar {
  box-sizing: border-box;
  padding: 0rem 1rem;
  display: flex;
  width: 100vw;
  height: 10vh;
  background-color: #ffffff;
  justify-content: space-around;
  align-items: center;
}
.shade {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  background-color: #333333;
  z-index: 66666;
  opacity: 0.9;
  .minishade {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.ico > img {
  width: 35px;
  height: 35px;
}
</style>
