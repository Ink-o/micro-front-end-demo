const axios = require('axios')
const { createSpinner } = require('nanospinner')
const git = require('git-promise')
const fs = require('fs-extra')
const path = require('path')

class Init {
  templates = {}
  async checkTemplate(url) {
    const { data } = await axios.get(url)
    return data
  }
  async setup(options) {
    if (typeof options.template === 'string') {
      // 获取模板
      const templates = await this.checkTemplate(options.template)
      if (templates) {
        this.templates = templates
      }
    }
    // 选择模板
    await this.selectTemplate(this.templates)
  }
  async selectTemplate(templates) {
    const inquirer = (await import('inquirer')).default
    // 让用户选择选项
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '项目名',
        default: function () {
          return 'zmp-project'
        }
      },
      {
        type: 'list', // 类型
        name: 'template',
        message: '请选择模板',
        choices: Object.keys(templates)
      }
    ])
    // 根据用户选中/输入的选项来进行下一步
    const gitRepo = this.templates[answers.template] // 获取 git 仓库地址
    console.log('answers.template: ', answers.template);
    await this.downloadRepo(gitRepo, answers.name)
  }
  async downloadRepo(repoPath, localPath) {
    // 创建一个动画
    const spinner = createSpinner()
    spinner.start({
      text: 'downloading\n'
    })
    // 克隆 git 项目
    // 将 repoPath 的项目下载到 localPath
    await git(`clone ${repoPath} ./${localPath}`)
    spinner.success({
      text: `cd ${localPath} & npm install & npm run dev`
    })
  }
}
module.exports = new Init()