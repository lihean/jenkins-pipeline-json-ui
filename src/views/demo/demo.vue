<template>
  <div class="demo-content" style="height: 100%;">
    <div style="position: relative;width: auto;height: 100%;">
      <svg :class="generateClass('svg')" id="stageSvg" :width="svgWidth">
        <path :class="generateClass('path')"
              v-for="(path, index) in pathList"
              :key="index"
              :d="path.d"
              stroke="#515a6e"
              stroke-width="1"
              fill="none"
        >
        </path>
      </svg>
      <div :class="generateClass('body')" id="stageBody">
        <div :class="generateClass('parent-div')"
             v-for="(stage, index) in pipeline.stages"
             :key="index"
        >
          <div :class="generateClass('container')"
               :id="'stageContent' + index"
          >
            <h3 :class="generateClass('title')" align="left">{{stage.name}}</h3>
            <div align="center" v-if="stage.parallel"
                 :class="generateClass('child-container')"
                 @mouseover="showAddStage(index)"
                 @mouseleave="hiddenAddStage(index)"
            >
              <div>

                <div align="center"
                     :class="generateClass('div')"
                     :id="stageDivPrefix + index"
                     :ref="stageDivPrefix + index"
                     v-for="(p, index1) in stage.parallel"
                     :key="index1"
                     @click="editStage(p)"
                >
                  <h4 style="margin: 5px 0;font-weight: unset;">{{p.name}}</h4>
                </div>
              </div>
              <div align="center" v-if="showAddStageSwitch[index]"
                   :class="generateClass('div')"
                   :id="stageDivPrefix + index"
                   :ref="stageDivPrefix + index"
                   @click="editStage(p)"
              >

                <div>
                  <Icon class="step-add-icon" type="md-add-circle" size="20" color="#515a6e"></Icon>
                  <h4 class="step-add-h">并行任务</h4>
                </div>
              </div>
            </div>
            <div v-else align="center"
                 :class="generateClass('child-container')"
                 @mouseover="showAddStage(index)"
                 @mouseleave="hiddenAddStage(index)"
            >
              <div align="center"
                   :class="generateClass('div')"
                   :id="stageDivPrefix + index"
                   :ref="stageDivPrefix + index"
                   v-for="(b, index1) in stage.branches"
                   :key="index1"
                   @click="editStage(b)"
              >
                <h4 style="margin: 5px 0;font-weight: unset;">{{b.name}}</h4>
              </div>
              <div align="center" v-if="showAddStageSwitch[index]"
                   :class="generateClass('div')"
                   :id="stageDivPrefix + index"
                   :ref="stageDivPrefix + index"
                   @click="editStage(p)"
              >
                <div>
                  <Icon class="step-add-icon" type="md-add-circle" size="20" color="#515a6e"></Icon>
                  <h4 class="step-add-h">并行任务</h4>
                </div>
              </div>
            </div>
          </div>
          <div :class="generateClass('split')"
               :id="'stageContent' + index"
          >
            <div :class="generateClass('add-btn')">
              <Icon
                :class="generateClass('add-icon')"
                :id="stageAddBtnPrefix + index"
                :ref="stageAddBtnPrefix + index"
                @click="addStage(index)"
                :size=22 type="md-add-circle"/>
            </div>
          </div>
        </div>
        <!--        <div :class="generateClass('add-new')">-->
        <!--          <div :class="generateClass('container')">-->
        <!--            <h3 class="stage-h" style="margin: 20px 20px;color: #515a6e;">新阶段</h3>-->
        <!--            <div align="center">-->
        <!--              <div align="center"-->
        <!--                   :class="generateClass('add')"-->
        <!--                   @click="addStage"-->
        <!--              >-->
        <!--                <h4 style="margin: 5px 0;">添加新阶段</h4>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </div>
    <Drawer :class="generateClass('drawer')"
            title="Create/Edit"
            v-model="showStageDrawer"
            width="560"
            :mask-closable="false"
            :styles="styles"
    >
      <Row :gutter="32">
        <Col span="24">
          <p class="stage-edit-p">任务名称</p>
          <Input v-model="formData.name" style="margin-top: 5px;" placeholder="输入任务名称"/>
        </Col>
      </Row>
      <Row :gutter="32" style="margin-top: 20px;">
        <Col span="24">
          <p class="stage-edit-p">任务步骤</p>
          <div style="margin-top: 10px;">
            <Icon style="float: left;" type="md-add-circle" size="20" color="#2d8cf0"></Icon>
            <p style="margin-left: 5px;float: left;color: #2d8cf0;">添加步骤</p>
          </div>
          <div>
            <Divider style="margin-top: 5px;"/>

            <Divider style="margin-top: 5px;"/>
          </div>
        </Col>
      </Row>
      <Row :gutter="32" style="margin-top: 20px;">
        <Col span="24">
          <p class="stage-edit-p">删除任务</p>
          <p style="font-size: 14px;margin: 5px 0 10px 0;">
            该任务将被彻底删除，注意这是不可逆操作，任务下所有数据将会删除
          </p>
          <Button style="border-color: #ffdede;color: #ed4014;" @click="deleteStageStep">删除</Button>
        </Col>
      </Row>
      <div class="demo-drawer-footer">
        <ButtonGroup style="margin-top: 15px;float: right;margin-right: 32px;">
          <Button @click="showStageDrawer = false">取消</Button>
          <Button type="primary" @click="showStageDrawer = false">保存</Button>
        </ButtonGroup>
      </div>
    </Drawer>
  </div>
</template>

<script>
  export default {
    name: "demo",
    data() {
      return {
        stageClassPrefix: 'stage-step-',
        stageDivPrefix: 'stage-step-div-',
        stageAddBtnPrefix: 'add-next-btn-',
        stepList: [
          {
            name: 'sh',
            desc: '执行SH脚本'
          }
        ],
        pipeline: {
          stages: [
            {
              name: "检出",
              branches: [{
                name: "default",
                steps: [{
                  name: "checkout",
                  arguments: [{
                    key: "scm",
                    value: {
                      "isLiteral": false,
                      "value": "[$class: \u0027GitSCM\u0027, branches: [[name: env.GIT_BUILD_REF]],\n                                                            userRemoteConfigs: [[url: env.GIT_REPO_URL, credentialsId: env.CREDENTIALS_ID]]]"
                    }
                  }]
                }]
              }]
            }, {
              name: "编译",
              branches: [{
                name: "default",
                steps: [{
                  name: "sh",
                  arguments: [{
                    key: "script",
                    value: {
                      "isLiteral": true,
                      "value": "./mvnw package -Dmaven.test.skip\u003dtrue"
                    }
                  }]
                }]
              }]
            },
            {
              name: "并行阶段 3",
              parallel: [{
                name: "单元测试",
                post: {
                  conditions: [{
                    condition: "always",
                    branch: {
                      name: "default",
                      steps: [{
                        name: "junit",
                        arguments: [{
                          key: "testResults",
                          value: {"isLiteral": true, "value": "target/surefire-reports/*.xml"}
                        }]
                      }]
                    }
                  }]
                },
                "branches": [{
                  "name": "default",
                  "steps": [{
                    "name": "sh",
                    "arguments": [{
                      "key": "script",
                      "value": {"isLiteral": true, "value": "./mvnw test"}
                    }]
                  }]
                }]
              }, {
                "name": "并行shell",
                "branches": [{
                  "name": "default",
                  "steps": [{
                    "name": "sh",
                    "arguments": [{"key": "script", "value": {"isLiteral": true, "value": "cd /"}}]
                  }, {
                    "name": "node",
                    "arguments": [{"key": "label", "value": {"isLiteral": true, "value": "s"}}],
                    "children": [{
                      "name": "sh",
                      "arguments": [{
                        "key": "script",
                        "value": {"isLiteral": true, "value": "cd /test-son"}
                      }]
                    }]
                  }]
                }]
              }]
            },
            {
              "name": "打包镜像",
              "branches": [{
                "name": "default",
                "steps": [{
                  "name": "sh",
                  "arguments": [{
                    "key": "script",
                    "value": {
                      "isLiteral": false,
                      "value": "\"docker build -t ${ARTIFACT_IMAGE}:${env.GIT_BUILD_REF} .\""
                    }
                  }]
                }, {
                  "name": "sh",
                  "arguments": [{
                    "key": "script",
                    "value": {
                      "isLiteral": false,
                      "value": "\"docker tag ${ARTIFACT_IMAGE}:${env.GIT_BUILD_REF} ${ARTIFACT_IMAGE}:latest\""
                    }
                  }]
                }]
              }]
            },
            {
              name: "并行阶段 3",
              parallel: [{
                name: "单元测试",
                post: {
                  conditions: [{
                    condition: "always",
                    branch: {
                      name: "default",
                      steps: [{
                        name: "junit",
                        arguments: [{
                          key: "testResults",
                          value: {"isLiteral": true, "value": "target/surefire-reports/*.xml"}
                        }]
                      }]
                    }
                  }]
                },
                "branches": [{
                  "name": "default",
                  "steps": [{
                    "name": "sh",
                    "arguments": [{
                      "key": "script",
                      "value": {"isLiteral": true, "value": "./mvnw test"}
                    }]
                  }]
                }]
              }, {
                "name": "并行shell",
                "branches": [{
                  "name": "default",
                  "steps": [{
                    "name": "sh",
                    "arguments": [{"key": "script", "value": {"isLiteral": true, "value": "cd /"}}]
                  }, {
                    "name": "node",
                    "arguments": [{"key": "label", "value": {"isLiteral": true, "value": "s"}}],
                    "children": [{
                      "name": "sh",
                      "arguments": [{
                        "key": "script",
                        "value": {"isLiteral": true, "value": "cd /test-son"}
                      }]
                    }]
                  }]
                }]
              }]
            },
            {
              "name": "推送到制品库",
              "branches": [{
                "name": "default",
                "steps": [{
                  "name": "script",
                  "arguments": [{
                    "key": "scriptBlock",
                    "value": {
                      "isLiteral": true,
                      "value": "docker.withRegistry(\"https://${ARTIFACT_BASE}\", \"${env.DOCKER_REGISTRY_CREDENTIALS_ID}\") {\n            docker.image(\"${ARTIFACT_IMAGE}:${env.GIT_BUILD_REF}\").push()\n            docker.image(\"${ARTIFACT_IMAGE}:latest\").push()\n          }"
                    }
                  }]
                }]
              }]
            }],
          "environment": [{
            "key": "ENTERPRISE",
            "value": {"isLiteral": true, "value": "citic_cpc"}
          }, {"key": "PROJECT", "value": {"isLiteral": true, "value": "coding-demo"}}, {
            "key": "ARTIFACT",
            "value": {"isLiteral": true, "value": "coding-demo"}
          }, {
            "key": "CODE_DEPOT",
            "value": {"isLiteral": true, "value": "coding-demo"}
          }, {
            "key": "ARTIFACT_BASE",
            "value": {"isLiteral": false, "value": "\"${ENTERPRISE}-docker.pkg.coding.net\""}
          }, {
            "key": "ARTIFACT_IMAGE",
            "value": {
              "isLiteral": false,
              "value": "\"${ARTIFACT_BASE}/${PROJECT}/${ARTIFACT}/${CODE_DEPOT}\""
            }
          }],
          agent: {"type": "any"}
        },
        pathList: [],
        showAddStageSwitch: [],
        showStageDrawer: false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        formData: {
          name: '',
          url: '',
          owner: '',
          type: '',
          approver: '',
          date: '',
          desc: ''
        },
        svgWidth: 0
      }
    },
    created() {
      this.init();
    },
    computed: {},
    mounted() {
      this.$nextTick(() => {
        window.addEventListener('resize', () => {
          let dom = document.getElementsByClassName('demo-content');
          dom.scrollTop = 0;
          dom.scrollLeft = 0;

          document.documentElement.scrollTop = 0;
          document.documentElement.scrollLeft = 0;
          this.stagePaths();
        });
        window.addEventListener('onunload', () => {
          let dom = document.getElementsByClassName('demo-content');
          dom.scrollTop = 0;
          dom.scrollLeft = 0;

          document.documentElement.scrollTop = 0;
          document.documentElement.scrollLeft = 0;
          this.stagePaths();
        })
      });
    },
    methods: {
      generateClass(suffix) {
        return this.stageClassPrefix + suffix;
      },
      showAdd(index) {
        return this.showAddStageSwitch[index];
      },
      init() {
        this.pipeline.stages.forEach(p => {
          this.showAddStageSwitch.push(false);
        });
        this.$nextTick(() => {
          setTimeout(() => {
            this.calculateSvgWidth();
            this.stagePaths();
          }, 200)
        });
      },
      getStepInfo(name) {
        let steps = this.stepList.filter(s => {
          return s.name == name;
        });

        return steps.length == 0 ? null : steps[0];
      },
      stagePaths() {
        this.pathList = [];
        let dom = document.getElementById('app');
        let verticalOffset = dom.getBoundingClientRect().width * 0.125;
        //对stages循环遍历计算path
        let i = 0;
        for (let index in this.pipeline.stages) {
          let nodes = this.getLocationSingle(this.stageDivPrefix + index);
          let btnNode = document.getElementById(this.stageAddBtnPrefix + index);
          if (null != btnNode) {
            for (let node of nodes) {
              let path = this.defaultPath(i++);
              path.d = this.calculatePath(node.getBoundingClientRect(), btnNode.getBoundingClientRect(), false, verticalOffset);
              this.pathList.push(path);
            }
          }

          if (index != 0) {
            let btnNode1 = document.getElementById(this.stageAddBtnPrefix + (index - 1));
            if (null == btnNode1) {
              continue;
            }
            for (let node of nodes) {
              let path = this.defaultPath(i++);
              path.d = this.calculatePath(btnNode1.getBoundingClientRect(), node.getBoundingClientRect(), true, verticalOffset);
              this.pathList.push(path);
            }
          }
        }
      },
      defaultPath(num) {
        return {
          d: null,
          name: 'stagePath' + num,
          stroke: '#515a6e',
          strokeWidth: 1
        }
      },
      getLocationSingle(name) {
        return this.$refs[name];
      },
      getLocation(name1, name2) {
        let node1 = this.$refs[name1];
        let node2 = this.$refs[name2];

        let ele1 = null;
        let ele2 = null;

        if (Array.isArray(node1)) {
          ele1 = node1[0];
        } else {
          ele1 = node1;
        }

        if (Array.isArray(node2)) {
          ele2 = node2[0];
        } else {
          ele2 = node2;
        }

        return [ele1, ele2]
      },
      calculatePath(ele1, ele2, desc, verticalOffset) {
        if (desc) {
          return 'M' + ((ele2.x - verticalOffset) + ' ' + (ele2.y + ele2.height * 0.5))
            + ' L' + ((ele1.x + ele1.width - verticalOffset) + (ele2.x - (ele1.x + ele1.width)) * 0.5) + ' ' + (ele2.y + ele2.height * 0.5)
            + ' L' + ((ele1.x + ele1.width - verticalOffset) + (ele2.x - (ele1.x + ele1.width)) * 0.5) + ' ' + (ele1.y + ele1.height * 0.5)
            + ' L' + (ele1.x + ele1.width - 2 - verticalOffset) + ' ' + (ele1.y + ele1.height * 0.5)
        } else {
          return 'M' + (ele1.x + ele1.width - verticalOffset) + ' ' + (ele1.y + ele1.height * 0.5)
            + ' L' + ((ele1.x + ele1.width - verticalOffset) + (ele2.x - (ele1.x + ele1.width)) * 0.5) + ' ' + (ele1.y + ele1.height * 0.5)
            + ' L' + ((ele1.x + ele1.width - verticalOffset) + (ele2.x - (ele1.x + ele1.width)) * 0.5) + ' ' + (ele2.y + ele2.height * 0.5)
            + ' L' + ((ele2.x + 2 - verticalOffset) + ' ' + (ele2.y + ele2.height * 0.5))
        }
      },
      submit() {
        this.showStageDrawer = false;
      },
      cancel() {
        this.showStageDrawer = false;
      },
      editStage(p) {
        this.showStageDrawer = true;
      },
      addStage(index) {
        this.$Message.info('新增stage');
        this.pipeline.stages.splice(index + 1, 0, {
          name: '新阶段',
          branches: [{
            name: "default",
            steps: []
          }]
        });
        console.log(this.pipeline.stages);
        this.calculateSvgWidth();
      },
      deleteStageStep() {

      },
      showAddStage(index) {
        console.log('show-add-stage-' + index);
        this.$set(this.showAddStageSwitch, index, true);
        this.$nextTick(() => {
          this.stagePaths();
        });
      },
      hiddenAddStage(index) {
        console.log('hidden-add-stage-' + index);
        this.$set(this.showAddStageSwitch, index, false);
        this.$nextTick(() => {
          this.stagePaths();
        });
      },
      calculateSvgWidth() {
        setTimeout(() => {
          let dom = document.getElementById('stageBody');
          console.log(dom.getBoundingClientRect());
          this.svgWidth = dom.getBoundingClientRect().width;
        }, 200);
      }
    }
  }
</script>

<style>
  .demo-content {
    width: 100%;
    background-color: rgba(240, 240, 240, .5);
  }

  .stage-step-parent-div {
    min-width: 300px;
    background-color: rgba(240, 240, 240, .5);
    display: table-cell;
    z-index: 10;
  }

  .stage-step-add-new {
    min-width: 200px;
    background-color: rgba(240, 240, 240, .5);
    display: table-cell;
    z-index: 10;
  }

  .stage-step-container {
    width: 90%;
    height: 770px;
    float: left;
  }

  .stage-step-child-container {
    width: 60%;
    margin: 0 auto;
    z-index: 10;
    height: 100%;
  }

  .stage-step-div {
    width: 100%;
    background-color: rgba(240, 240, 240, .5);
    border: 1px solid #515a6e;
    margin: 5px 0 20px 0;
    border-radius: 36px;
    cursor: pointer;
    position: relative;
    z-index: 10;
  }

  .stage-step-div:hover {
    border-color: #2d8cf0;
    color: #2d8cf0;
  }

  .stage-step-title {
    margin: 20px 20px;
    position: relative;
    z-index: 10;
    cursor: unset;
  }

  .stage-step-split {
    width: 10%;
    float: right;
    height: 770px;
    text-align: center;
  }

  .stage-step-add-btn:before {
    content: "";
    height: 100%;
    border-left: 1px solid #d9d9d9;
    position: absolute;
    z-index: 10;
  }

  .stage-step-add-btn {
    position: relative;
    cursor: pointer;
    color: #8c8c8c;
    height: 100%;
    z-index: 10;
  }

  .stage-step-add-icon {
    position: absolute;
    top: 70px;
    margin-left: -11px;
    z-index: 10;
  }

  .demo-drawer-footer {
    width: 100%;
    border-top: 1px solid #e8eaec;
    position: absolute;
    bottom: 0;
    background: #ffffff;
    height: 60px;
    margin-left: -16px;
  }

  .stage-step-svg {
    /*width: 2000px;*/
    position: absolute;
    top: 0;
    left: 0;
    height: 770px;
    float: left;
    background-color: rgba(240, 240, 240, .0);
    z-index: 0;
  }

  .stage-step-body {
    position: absolute;
    top: 0;
    left: 0;
    height: 770px;
    width: auto;
    float: left;
    background-color: rgba(240, 240, 240, .0);
    z-index: 0;
  }

  .stage-step-path {
    z-index: 20;
    cursor: pointer;
    padding: 10px 0;
  }

  .stage-step-add {
    width: 60%;
    background: #f0f0f0;
    border: 1px solid #515a6e;
    margin: 5px 10px 20px 10px;
    border-radius: 10px;
    cursor: pointer;
    z-index: 10;
  }

  .stage-edit-p {
    font-size: 15px;
  }

  .step-add-icon {
    display: inline-block;
    margin: 5px 0;
  }

  .step-add-h {
    margin: 5px 0;
    font-weight: unset;
    display: inline-block;
  }

</style>
