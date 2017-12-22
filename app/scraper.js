'use strict'

const puppeteer = require('puppeteer')
const _ = require('lodash')

async function filter (user, password, keywords) {

 const browser = await puppeteer.launch({headless: true})
 const page = await browser.newPage()
 await page.goto('https://www.facebook.com/')
 await page.waitForSelector('#loginbutton')
 await page.type('#email', user)
 await page.type('#pass', password)
 await page.click('#loginbutton')
 await page.waitForNavigation({waitUntil:'domcontentloaded'})

 for (let i=0; i < 5000; i++){
  await page.keyboard.press('ArrowDown')
 }

 const posts = await page.evaluate(() => {
  const results = Array.from(document.querySelectorAll('div.userContentWrapper'))
  return results.map(result => {
   return {
    text: result.querySelector('div:nth-child(2)').textContent,
    url: (result.querySelector('div:nth-child(2) a._52c6')||{}).href,
    img: (result.querySelector('div:nth-child(2) img.scaledImageFitWidth')||{}).src
   }
  })
  return results
 });

 let results = _.filter(posts,(o) => {
  return (new RegExp(keywords.join("|")).test(o.text))
 })

 browser.close()

 return results

}

module.exports = filter