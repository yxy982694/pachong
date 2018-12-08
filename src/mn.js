const puppeteer = require('puppeteer');
const {mn}=require('./config/default');
const srcToImg=require('../helper/srcToImg');
(async () => {   //异步执行函数
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://image.baidu.com/');
  console.log('go to https://image.baidu.com/');
	//改变浏览器窗口
  await page.setViewport({  
  	width:1920,
  	height:1080
  });

  await page.focus('#kw');//获得焦点，写入input输入框的id
  await page.keyboard.sendCharacter('狗');//模拟键盘输入字符
  await page.click('.s_search');//模拟鼠标的点击‘百度一下’
  console.log('go to search list');
	//等待列表页加载完成
	//images并没有map方法，通过call
  page.on('load',async ()=>{   
  	console.log('图片加载完成，可以获取图片了');
  	const srcs=await page.evaluate(()=>{
  		const images=document.querySelectorAll('img.main_img');
  		return Array.prototype.map.call(images,img=>img.src);
  	})
  	console.log(`get${srcs.length} images,start download`);
  	
  	srcs.forEach(async (src)=>{
  		await page.waitFor(200);
  		await srcToImg(src,mn);
  	})
  });
  await browser.close();
})();