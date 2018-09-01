import "babel-polyfill";
import expect from "expect.js";
import puppeteer from "puppeteer";

function waitForLoadEnd(page) {
  return page.waitForFunction("document.querySelectorAll('.Loading').length === 0");
}

function waitForLoadStart(page) {
  return page.waitForSelector(".Loading");
}

describe("Kanban", function() {
  this.timeout(5000);

  let browser, page;

  before(async function() {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    page = await browser.newPage();
    await page.setViewport({
      height: 900,
      width: 1440
    });
  });

  after(async function() {
    await browser.close();
  });

  /**
   * Log In
   */
  it("we should be able to log in", async function() {
    const response = await page.goto("http://localhost:8000");
    expect(response.status()).to.be(200);

    await page.waitForSelector(".Login");
    expect(page.url()).to.be("http://localhost:8000/auth/login");
    await page.type('.Login_field[name="username"]', "test");
    await page.type('.Login_field[name="password"]', "asdasd123");
    await page.click('.Login_button');

    await waitForLoadStart(page);
    await waitForLoadEnd(page);
    expect(page.url()).to.be("http://localhost:8000/");
  });

  /**
   * View Card
   */
  it("we should be able to view cards", async function() {
    expect(page.url()).to.be("http://localhost:8000/");

    await page.waitForSelector(".KanbanColumn_ticket");
    expect(await page.$eval("#KanbanCard_1 span", node => node.innerText)).to.be("#1");
    expect(await page.$eval("#KanbanCard_1 a", node => node.innerText)).to.be("Hello, World");
  });
});
