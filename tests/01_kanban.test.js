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
    await page.click(".Login_button");

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
    expect(await page.$eval("#HeaderNav_user u", node => node.innerText)).to.be("test");
    expect(await page.$eval("#HeaderNav_project", node => node.innerText)).to.be("Khanban");
    expect(await page.$$eval(".KanbanColumn_ticket", nodes => nodes.length)).to.be(1);
    expect(await page.$eval("#KanbanCard_1 span", node => node.innerText)).to.be("#1");
    expect(await page.$eval("#KanbanCard_1 a", node => node.innerText)).to.be("Hello, World");
    await page.click("#KanbanCard_1 a");

    await page.waitForSelector(".CardDetail");
    expect(page.url()).to.be("http://localhost:8000/card/1");
    expect(await page.$eval(".CardDetail_title", node => node.innerText.replace(/\s+/g, " "))).to.be("#1 Hello, World");
    expect(await page.$eval(".CardDetail_description", node => node.innerText)).to.be("The quick brown fox jumps over the lazy dog.");
  });

  /**
   * Edit Card
   */
  it("we should be able to edit cards", async function() {
    expect(page.url()).to.be("http://localhost:8000/card/1");
    expect(await page.$$eval(".CardDetail_revisions-select option", nodes => nodes.length)).to.be(2);

    await page.click('.CardDetail_button[name="edit"]');
    await page.waitForSelector('.CardDetail_field[name="title"]');
    await page.type('.CardDetail_field[name="title"]', "!");
    await page.type('.CardDetail_field[name="description"]', " Another one.");
    await page.click('.CardDetail_button[name="save"]');

    await waitForLoadStart(page);
    await waitForLoadEnd(page);
    await page.waitForFunction("document.querySelectorAll('.CardDetail_revisions-select option').length === 3");
    expect(await page.$eval(".CardDetail_title", node => node.innerText.replace(/\s+/g, " "))).to.be("#1 Hello, World!");
    expect(await page.$eval(".CardDetail_description", node => node.innerText)).to.be("The quick brown fox jumps over the lazy dog. Another one.");
    expect(await page.$eval("#KanbanCard_1 a", node => node.innerText)).to.be("Hello, World!");
  });

  /**
   * View Card Revision
   */
  it("we should be able to view card revisions", async function() {
    expect(page.url()).to.be("http://localhost:8000/card/1");
    expect(await page.$$eval(".CardDetail_revisions-select option", nodes => nodes.length)).to.be(3);

    let revision = await page.$eval(".CardDetail_revisions-select option:last-child", node => node.getAttribute("value"));
    await page.select(".CardDetail_revisions-select", revision);
    await page.waitForSelector('.CardDetail_button[name="edit"]', {
      hidden: true
    });
    expect(page.url()).to.be("http://localhost:8000/card/1/revision/1");
    expect(await page.$eval(".CardDetail_title", node => node.innerText.replace(/\s+/g, " "))).to.be("#1 Initial Title");
    expect(await page.$eval(".CardDetail_description", node => node.innerText)).to.be("Initial description.");

    revision = await page.$eval(".CardDetail_revisions-select option:first-child", node => node.getAttribute("value"));
    await page.select(".CardDetail_revisions-select", revision);
    await page.waitForSelector('.CardDetail_button[name="edit"]');
    expect(page.url()).to.be("http://localhost:8000/card/1/revision/3");
    expect(await page.$eval(".CardDetail_title", node => node.innerText.replace(/\s+/g, " "))).to.be("#1 Hello, World!");
    expect(await page.$eval(".CardDetail_description", node => node.innerText)).to.be("The quick brown fox jumps over the lazy dog. Another one.");
  });

  /**
   * Add Card
   */
  it("we should be able to add cards", async function() {
    expect(page.url()).to.be("http://localhost:8000/card/1/revision/3");

    await page.click(".KanbanColumn:nth-child(2) .KanbanColumn_header-add");
    await page.waitForSelector('.CardDetail_button[name="save"]');
    await page.type('.CardDetail_field[name="title"]', "New Card");
    await page.type('.CardDetail_field[name="description"]', "The description.");
    await page.click('.CardDetail_button[name="save"]');

    await waitForLoadStart(page);
    await waitForLoadEnd(page);
    await page.waitForSelector(".KanbanColumn:nth-child(2) #KanbanCard_2");
    expect(await page.$$eval(".KanbanColumn_ticket", nodes => nodes.length)).to.be(2);
    expect(await page.$$eval(".KanbanColumn:nth-child(1) .KanbanColumn_ticket", nodes => nodes.length)).to.be(1);
    expect(await page.$$eval(".KanbanColumn:nth-child(2) .KanbanColumn_ticket", nodes => nodes.length)).to.be(1);

    await page.click("#KanbanCard_2 a");
    await page.waitForSelector(".CardDetail_title");
    expect(page.url()).to.be("http://localhost:8000/card/2");
    expect(await page.$eval(".CardDetail_title", node => node.innerText.replace(/\s+/g, " "))).to.be("#2 New Card");
    expect(await page.$eval(".CardDetail_description", node => node.innerText)).to.be("The description.");
    expect(await page.$eval("#KanbanCard_2 span", node => node.innerText)).to.be("#2");
    expect(await page.$eval("#KanbanCard_2 a", node => node.innerText)).to.be("New Card");
  });

  /**
   * Move Card
   */
  it("we should be able to move cards", async function() {
    expect(page.url()).to.be("http://localhost:8000/card/2");
    expect(await page.$$eval(".KanbanColumn_ticket", nodes => nodes.length)).to.be(2);
    expect(await page.$$eval(".KanbanColumn:nth-child(1) .KanbanColumn_ticket", nodes => nodes.length)).to.be(1);
    expect(await page.$$eval(".KanbanColumn:nth-child(2) .KanbanColumn_ticket", nodes => nodes.length)).to.be(1);

    await page.evaluate(() => {
      document.querySelector(".Kanban_container").scrollTo(0, 0);
    });
    const card = await page.$("#KanbanCard_2");
    const card_box = await card.boundingBox();
    const drop = await page.$(".KanbanColumn:nth-child(1) .KanbanColumn_container")
    const drop_box = await drop.boundingBox();
    await page.mouse.move(card_box.x + (card_box.width / 2), card_box.y + (card_box.height / 2));
    await page.mouse.down();
    await page.waitFor(100);
    await page.mouse.move(drop_box.x + (drop_box.width / 2), drop_box.y + (drop_box.height / 2), { steps: 10 });
    await page.waitFor(100);
    await page.mouse.up();

    await waitForLoadStart(page);
    await waitForLoadEnd(page);
    expect(await page.$$eval(".KanbanColumn_ticket", nodes => nodes.length)).to.be(2);
    expect(await page.$$eval(".KanbanColumn:nth-child(1) .KanbanColumn_ticket", nodes => nodes.length)).to.be(2);
    expect(await page.$$eval(".KanbanColumn:nth-child(2) .KanbanColumn_ticket", nodes => nodes.length)).to.be(0);
  });

  /**
   * Archive Card
   */
  it("we should be able to archive cards", async function() {
    expect(page.url()).to.be("http://localhost:8000/card/2");
    expect(await page.$$eval(".KanbanColumn_ticket", nodes => nodes.length)).to.be(2);

    await page.click("#KanbanCard_1 a");
    await page.waitForFunction("document.querySelectorAll('.CardDetail_revisions-select option').length === 3");
    await page.click('.CardDetail_button[name="archive"]');

    await waitForLoadStart(page);
    await waitForLoadEnd(page);
    await page.waitForSelector(".CardDetail", {
      hidden: true
    });
    await page.waitForSelector("#KanbanCard_1", {
      hidden: true
    });
    expect(page.url()).to.be("http://localhost:8000/");
    expect(await page.$$eval(".KanbanColumn_ticket", nodes => nodes.length)).to.be(1);
  });

  /**
   * Log Out
   */
  it("we should be able to log out", async function() {
    expect(page.url()).to.be("http://localhost:8000/");

    await page.click("#HeaderNav_user");
    await page.waitForSelector("#ContextMenu_logout");
    await page.click("#ContextMenu_logout");
    await waitForLoadStart(page);
    await page.waitForSelector(".Login");
    expect(page.url()).to.be("http://localhost:8000/auth/login");
  });
});
