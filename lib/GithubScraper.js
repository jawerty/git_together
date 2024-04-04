const path = require("path");
const puppeteer = require("puppeteer");

const { setupBrowser, timeout } = require("./utils");

class GithubScraper {
	constructor() {
		this.user = null // string for the github profile	
		this.browser = null
		this.page = null
	}

	setUser(user) {
		this.user = user
		this.generateUrls(this.user)
	}

	generateUrls(user) {
		this.repositoriesPage = `https://github.com/${user}?tab=repositories`
		this.defaultPage = `https://github.com/${user}`
	}

	async inferenceLLM(prompt, attempts, is_json) {
		const model = "mistralai/Mixtral-8x7B-Instruct-v0.1"
        const data = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.75,
            
        }
        if (is_json) {
        	data["stop"] = "``"
        }
        const baseUrl = "https://api.endpoints.anyscale.com/v1/chat/completions"


        const response = await fetch(baseUrl, {
        	method: "POST",
        	headers: {
        		Authorization: `Bearer esecret_td4b6dak9rzjlu6mv352t6ftnh`,
        		"Content-Type": "application/json"
        	},
        	body: JSON.stringify(data)
        });


        const result = await response.json() 



        const content = result['choices'][0]['message']['content']
        console.log(content)
        if (is_json) {
        	const maxAttempts = 5
        	if (attempts >= maxAttempts) {
        		return;
        	}
        	try {
	        	const parsedContent = JSON.parse(content.trim())
	        	return parsedContent
        	} catch(e) {
        		console.log(e)
        		return this.inferenceLLM(prompt, attempts+1, is_json)
        	}
        } else {
        	return content
        }
	} 

	async getRepoInfo () {
		let nextEnabled = true
		
		let repos = []
		
		const scrapeRepoPage = async (pageNum) => {
			await this.page.goto(`${this.repositoriesPage}&page=${pageNum}`)
			
			const pageRepos = await this.page.evaluate(() => {
				return Array.from(document.querySelectorAll("#user-repositories-list li")).map((el) => {
				    return { language: el.querySelector("[itemprop=\"programmingLanguage\"]")?.innerText.trim(), stars: el.querySelector("[href*='/stargazers']")?.innerText.trim(), forks: el.querySelector("[href*='/forks']")?.innerText.trim() }
				})
			}) 

			repos = repos.concat(pageRepos)

			const isEnd = await this.page.evaluate(() => {
				if (!document.querySelector(".next_page")) {
					return true;
				}

				return document.querySelector(".next_page").getAttribute("aria-disabled") === 'true'
			});

			if (isEnd) {
				return null
			} else {
				return scrapeRepoPage(pageNum+1)
			}
		}	

		try {
			await scrapeRepoPage(1)
		} catch(e) {
			console.log(e)
		}
		
		return repos
	}

	async getContributionsPicture() {
		try {
			const element = await this.page.$(".js-yearly-contributions");
				
			if (element) {
				await element.screenshot({
				    path: path.join(__dirname, `../static/screenshots/${this.user}.png`)
				});

				return true	
			}
		
		} catch(e) {
			console.log(e)
		}
		
		return false
	}

	getBadges (repos) {
		console.log(repos)
		const badges = []

		const languageUsage = {}
		
		let stars = 0
		let forks = 0
		for (let repo of repos) {
			if (repo.language in languageUsage) {
				languageUsage[repo.language] += 1
			} else {
				languageUsage[repo.language] = 1
			}
			if (repo.stars) {
				stars += parseInt(repo.stars)
			}
			if (repo.forks) {
				forks += parseInt(repo.forks)
			}
		}

		const sortedLanguages = Object.keys(languageUsage).map((language) => {
			return { language, usage: languageUsage[language] }
		}).sort((a, b) => {
			return b["usage"] - a["usage"]
		})

		const languages = sortedLanguages.slice(0, 2);


		for (let language of languages) {
			const languageString = language.language
			if (languageString === "Python") {
				badges.push("A simple kinda guy (Pythonista)")
			} else if (languageString === "JavaScript") {
				badges.push("A sensitive boy (JS Fiend)")
			} else if (languageString === "C++") {
				badges.push("Still in college (Loves C++)")
			} else if (languageString === "C") {
				badges.push("Chad (Loves C)")
			} else if (languageString === "Rust") {
				badges.push("Genuinely Good Looking (Rusthead)")
			} else if (languageString === "Jupyter Notebooks") {
				badges.push("Will be a billionaire (Jupyter Notebooks)")
			} else if (languageString === "PHP") {
				badges.push("Probably poor but means well (Loves PHP)")
			} else if (languageString === "Java") {
				badges.push("A boring POS (Java bro)")
			} else if (languageString === "Java") {
				badges.push("A boring POS (Java bro)")
			} else if (languageString === "Assembly") {
				badges.push("Must be put on a list (Loves Assembly)")
			}
		}

		if (stars >= 500) {
			badges.push("Attention Whore (>500 stars)")
		} else if (stars >= 2000) {			
			badges.push("Genuine Chad (>2000 stars)")
		}

		if (forks >= 100) {
			badges.push("Kind of a big deal (>100 forks)")
		} else if (forks >= 500) {			
			badges.push("Sexy beast (>500 forks)")
		}

		if ((stars / repos.length) > 5) {
			badges.push("Consistent and noble (avg > 5 stars)")
		} else if ((stars / repos.length) > 10) {
			badges.push("High Status (avg > 20 stars)")
		}

		return { badges, stars, forks, languages }
	}

	async getScore(stars, forks, followers, repoCount, commits) {
		const prompt = `
			You are a Github dateability bot. Your role is to look at information from a GitHub profile, judge it based on our standard for what is 100% and give a number from 0-100 as your response judging the profile.js-profile-editable-area

			Yes, dateability is about actually dating

			Here are the standards for what makes a good github date:
			- Has a lot of stars on their repos
			- Has a lot of followers
			- Has active engagement and has a lot of forks
			- Has a lot of repos
			- Has made a lot of commits in the past year (think multiple commits a day)

			Side notes:
			- A lot of follower is more than 100
			- A lot of repos is more than 50
			- A lot of stars is more than 1000
			- A lot of forks is more than 100
			- A lot of commits is more than days in the years

			Now here is the information about the github user you are judging:
			Total Stars: ${stars}
			Total Forks: ${forks}
			Followers: ${followers}
			Repo Count: ${repoCount}
			Commits: ${commits}

			Your response must be in json format, here's an example: { "score": 67 }

			- DO NOT REPLY WITH AN EXPLANATION OR ANYTHING OTHER THAN THE JSON WITH THE SCORE FIELD
			- DO NOT REPLY WITH ANYTHING OTHER THAN YOUR JSON, ONLY REPLY WITH THE JSON. IMAGINE YOUR RESPONSE WILL BE PASSED DIRECTLY INTO A JSON.parse() FUNCTION.IMAGINE YOUR RESPONSE WILL BE PASSED DIRECTLY INTO A JSON.parse() FUNCTION. YOUR RESPONSE MUST BE ABLE TO PASS JSON LINTING
			- DO NOT REPLY WITH ANY AFFIRMATIVE OR RESPONSE OTHER THAN THE SCORE JSON 
			- END YOUR JSON WITH 3 BACKTICKS FOR MARKDOWN FORMAT
		`
		const result = await this.inferenceLLM(prompt, 1, true);
		console.log(result);
		return result['score']
	}

	async getBio (stars, forks, followers, repoCount, commits, languages, name) {
		const prompt = `
			You are a Github dating bio making bot. Your role is to look at information from a GitHub profile and return an overview of this person and why they are worthy of love

			
			Now here is the information about the github user you are judging:
			Name: ${name}
			Total Stars: ${stars}
			Total Forks: ${forks}
			Followers: ${followers}
			Repo Count: ${repoCount}
			Commits: ${commits}

			Languages they like: ${languages.map((lang) => lang.language)}

			- DO NOT REPLY WITH AN EXPLANATION OR ANYTHING OTHER THAN THE BIO

			Now reply with the bui
		`
		const result = this.inferenceLLM(prompt);
		return result
	}

	async fetchMatchMakerData() {
		const [browser, page] = await setupBrowser();

		this.browser = browser;
		this.page = page;

		await page.goto(this.defaultPage, { timeout: 30000 })

		const actualTechBroName = await page.evaluate(() => {
			return document.querySelector("[itemprop='name']").innerText
		});

		const followersHref = `https://github.com/${this.user}?tab=followers`;
		const followingHref = `https://github.com/${this.user}?tab=following`;
		const followers = await page.evaluate((followersHref) => {
			return document.querySelector(".js-profile-editable-area [href='"+followersHref+"']").innerText
		}, followersHref);

		const followings = await page.evaluate((followingHref) => {
			return document.querySelector(".js-profile-editable-area [href='"+followingHref+"']").innerText
		}, followingHref);

		const location = await page.evaluate(() => {
			return document.querySelector('[itemprop="homeLocation"]').innerText;
		})


		await page.evaluate(() => {
		  window.scrollBy(0, 2000);
		});

		await page.waitForSelector(".js-yearly-contributions")
		const commits = await page.evaluate(() => {
			return document.querySelector(".js-yearly-contributions .text-normal").innerText
		});

		const hasContribImage = await this.getContributionsPicture()

		const imageUrl = await page.evaluate(() => {
			return document.querySelector("[itemprop=\"image\"]").href
		});

		const reposInfo = await this.getRepoInfo();

		const { badges, stars, forks, languages } = this.getBadges(reposInfo)
		
		const score = await this.getScore(stars, forks, followers.trim(), reposInfo.length, commits)

		console.log(score)
		const datingBio = await this.getBio(stars, forks, followers.trim(), reposInfo.length, commits, languages, actualTechBroName)
		
		return {
			actualTechBroName,
			followers,
			followings,
			location,
			hasContribImage,
			imageUrl,
			badges,
			stars,
			forks,
			languages,
			score,
			datingBio
		}
	}
}

module.exports = GithubScraper