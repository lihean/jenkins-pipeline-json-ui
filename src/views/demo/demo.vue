<template>
  <div class="demo-content" style="height: 100%;">
    <div style="position: relative;width: auto;height: 100%;">
      <div :class="generateClass('body')" id="stageBody">
        <div :class="generateClass('parent-div')"
             v-for="(stage, index) in pipeline.stages"
             :key="index"
        >
          <div :class="generateClass('split', index)"
               :id="'stageContent' + index"
          >
            <div :class="generateAddStageStepBtnClass('add-btn', index)">
              <Icon
                :class="generateClass('add-icon')"
                :id="stageAddBtnPrefix + index"
                :ref="stageAddBtnPrefix + index"
                @click="addStage(index)"
                :size=22 type="md-add-circle"/>
            </div>
          </div>
          <div :class="generateClass('container')"
               :id="'stageContent' + index"
          >
            <h3 :class="generateClass('stage-title')" align="left">{{stage.name}}</h3>
            <div align="center" v-if="stage.parallel"
                 :class="generateClass('stages')"
                 @mouseover="showAddParallelTask(index)"
                 @mouseleave="hiddenAddParallelTask(index)"
            >
              <div align="center"
                   :class="generateStageStepClass('stage-step', stage.parallel, index, index1)"
                   :id="stageDivPrefix + index"
                   :ref="stageDivPrefix + index"
                   v-for="(p, index1) in stage.parallel"
                   :key="index1"
                   @click="editStage(p)"
              >
                <div :class="generateClass('stage-step-content')">
                  <div class="step-content">
                    <div style="display: inline-block;">{{p.name}}</div>
                  </div>
                </div>
              </div>
              <div align="center" v-if="showAddStageSwitch[index]"
                   :class="generateAddStageStepClass('stage-step')"
                   :id="stageDivPrefix + index"
                   :ref="stageDivPrefix + index"
                   @click="addParallelTask(index)"
              >
                <div :class="generateClass('stage-step-content pipeline-job-stage-step-content-add')">
                  <div class="step-content step-content-add">
                    <div style="display: inline-block;">
                      <Icon class="step-add-icon" type="md-add-circle" size="19" color="#515a6e"/>
                      并行任务
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else align="center"
                 :class="generateClass('stages')"
                 @mouseover="showAddParallelTask(index)"
                 @mouseleave="hiddenAddParallelTask(index)"
            >
              <div align="center"
                   :class="generateStageStepClass('stage-step', stage.branches, index, index1)"
                   :id="stageDivPrefix + index"
                   :ref="stageDivPrefix + index"
                   v-for="(b, index1) in stage.branches"
                   :key="index1"
                   @click="editStage(b)"
              >
                <div :class="generateClass('stage-step-content')">
                  <div class="step-content">
                    <div style="display: inline-block;">{{b.name}}</div>
                  </div>
                </div>
              </div>
              <div align="center" v-if="showAddStageSwitch[index]"
                   :class="generateAddStageStepClass('stage-step')"
                   :id="stageDivPrefix + index"
                   :ref="stageDivPrefix + index"
                   @click="addParallelTask(index)"
              >
                <div :class="generateClass('stage-step-content pipeline-job-stage-step-content-add')">
                  <div class="step-content step-content-add">
                    <div style="display: inline-block;">
                      <Icon class="step-add-icon" type="md-add-circle" size="19" color="#515a6e"/>
                      并行任务
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div :class="generateClass('add-new')">
          <div :class="generateClass('split')"
          >
            <div :class="generateAddStageStepBtnClass('add-btn', pipeline.stages.length)">
              <Icon
                :class="generateClass('add-icon')"
                @click="addStage(pipeline.stages.length)"
                :size=22 type="md-add-circle"/>
            </div>
          </div>
          <div :class="generateClass('container')" style="padding: 0 20px 0 0;">
            <h3 class="stage-h" style="margin: 20px 20px;color: #515a6e;">新阶段</h3>
            <div align="center" :class="generateClass('stages')" style="margin-right: 20px;">
              <div align="center"
                   style="width: 100%;"
                   :class="generateAddStageStepClass('stage-step', 0)"
                   @click="addStage"
              >
                <div :class="generateClass('stage-step-content pipeline-job-stage-step-content-add')"
                     style="width: 100%;">
                  <div class="step-content step-content-add">
                    <div style="display: inline-block;">
                      <Icon class="step-add-icon" type="md-add-circle" size="19" color="#515a6e"/>
                      新的任务
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Drawer :class="generateClass('drawer')"
            stage-title="Create/Edit"
            v-model="showStageDrawer"
            width="560"
            :mask-closable="false"
            :styles="styles"
    >
      <Row :gutter="32">
        <Col span="24">
          <p class="stage-edit-p">任务名称</p>
          <Input v-model="stepData.name" style="margin-top: 5px;" placeholder="输入任务名称"/>
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
    <pipeline-component v-if="showAddStage" :show-modal="showAddStage" :components="components" @cancelAddStage="cancelAddStage">

    </pipeline-component>
  </div>
</template>

<script>
  import pipelineComponent from "./pipelineComponent";

  export default {
    name: "demo",
    components: {
      pipelineComponent
    },
    data() {
      return {
        stageClassPrefix: 'pipeline-job-flow pipeline-job-',
        stageDivPrefix: 'pipeline-job-div-',
        stageAddBtnPrefix: 'add-next-btn-',
        components: [
          {
            value: 'java规范扫描',
            label: 'java规范扫描'
          },
          {
            value: 'python规范扫描',
            label: 'python规范扫描'
          }
        ],
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
                      "value": "./mvn package -Dmaven.test.skip\u003dtrue"
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
        showAddStage: false,
        showStageDrawer: false,
        styles: {
          height: 'calc(100%)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        stepData: {
          name: '',
          url: '',
          owner: '',
          type: '',
          approver: '',
          date: '',
          desc: ''
        },
        currentIndex: 0
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
        });
        window.addEventListener('onunload', () => {
          let dom = document.getElementsByClassName('demo-content');
          dom.scrollTop = 0;
          dom.scrollLeft = 0;

          document.documentElement.scrollTop = 0;
          document.documentElement.scrollLeft = 0;
        })
      });
    },
    methods: {
      init() {
        this.pipeline.stages.forEach(p => {
          this.showAddStageSwitch.push(false);
        });
      },
      generateClass(suffix) {
        return this.stageClassPrefix + suffix;
      },
      generateStageStepClass(suffix, data, stageIndex, stepIndex) {
        if (stepIndex == 0) {
          return this.stageClassPrefix + suffix + ' pipeline-job-' + suffix + '-capsule-first';
        }

        if (Array.isArray(data)) {
          if (stepIndex == data.length - 1) {
            if (this.showAddStageSwitch[stageIndex]) {
              return this.stageClassPrefix + suffix + ' pipeline-job-' + suffix + '-capsule';
            } else {
              return this.stageClassPrefix + suffix + ' pipeline-job-' + suffix + '-capsule-latest';
            }
          } else {
            return this.stageClassPrefix + suffix + ' pipeline-job-' + suffix + '-capsule';
          }
        }

        return this.stageClassPrefix + suffix + ' pipeline-job-' + suffix + '-capsule';
      },
      generateAddStageStepClass(suffix, stepIndex) {
        if (stepIndex == 0) {
          return this.stageClassPrefix + suffix + ' pipeline-job-' + suffix + '-capsule-first';
        }

        return this.stageClassPrefix + suffix + ' pipeline-job-' + suffix + '-capsule-latest';
      },
      generateAddStageStepBtnClass(suffix, stageIndex) {
        if (stageIndex == 0) {
          return this.stageClassPrefix + suffix + '-first';
        }

        return this.stageClassPrefix + suffix;
      },
      getStepInfo(name) {
        let steps = this.stepList.filter(s => {
          return s.name == name;
        });

        return steps.length == 0 ? null : steps[0];
      },
      showAdd(index) {
        return this.showAddStageSwitch[index];
      },
      submit() {
        this.showStageDrawer = false;
      },
      cancel() {
        this.showStageDrawer = false;
      },
      // stage相关方法
      editStage(p) {
        this.showStageDrawer = true;
      },
      addStage(index) {
        this.currentIndex = index;
        this.$Message.info('新增stage');
        this.pipeline.stages.splice(this.currentIndex, 0, {
          name: '新阶段',
          branches: [{
            name: "default",
            steps: []
          }]
        });
        console.log(this.pipeline.stages);
        this.showAddStage = true;
      },
      cancelAddStage() {
        this.showAddStage = false;
        this.pipeline.stages.splice(this.currentIndex, 1);
      },
      deleteStageStep() {

      },
      // 并行任务相关方法
      showAddParallelTask(index) {
        console.log('show-add-stage-' + index);
        this.$set(this.showAddStageSwitch, index, true);
      },
      hiddenAddParallelTask(index) {
        console.log('hidden-add-stage-' + index);
        this.$set(this.showAddStageSwitch, index, false);
      },
      addParallelTask(index) {
        this.$Message.info("请选择要添加的组件");
        this.showAddStage = true;
      },
      cancelAddParallelTask(index) {
        this.$Message.info("取消添加组件");
        this.showAddStage = false;
      }
    }
  }
</script>

<style>
  .demo-content {
    width: 100%;
    background-color: rgba(240, 240, 240, .5);
  }

  .pipeline-job-parent-div {
    min-width: 300px;
    background-color: rgba(240, 240, 240, .5);
    display: table-cell;
    z-index: 10;
  }

  .pipeline-job-add-new {
    min-width: 200px;
    background-color: rgba(240, 240, 240, .5);
    display: table-cell;
    z-index: 10;
  }

  .pipeline-job-container {
    width: 80%;
    height: 745px;
    float: left;
  }

  .pipeline-job-stages {
    width: 100%;
    margin: 0 auto;
    z-index: 10;
    /*height: 100%;*/
  }

  .pipeline-job-stage-step {
    width: 100%;
    height: 56px;
    position: relative;
    z-index: 10;
  }

  .pipeline-job-stage-step-capsule:before {
    content: "";
    position: absolute;
    top: -75%;
    left: 0;
    border-left: 1px solid #d9d9d9;
    border-right: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
    width: 100%;
    height: 100%;
  }

  .pipeline-job-stage-step-capsule-first:before {
    content: "";
    position: absolute;
    top: -75%;
    left: 0;
    /*border-left: 1px solid #d9d9d9;*/
    /*border-right: 1px solid #d9d9d9;*/
    border-bottom: 1px solid #d9d9d9;
    width: 100%;
    height: 100%;
  }

  .pipeline-job-stage-step-capsule-latest:before {
    content: "";
    position: absolute;
    top: -75%;
    left: 0;
    border-left: 1px solid #d9d9d9;
    border-right: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    width: 100%;
    height: 100%;
  }

  .pipeline-job-stage-step:hover {
    border-color: #2d8cf0;
    color: #2d8cf0;
  }

  .pipeline-job-stage-step-content {
    /*min-width: 100px;*/
    width: 80%;
    background-color: rgb(240, 240, 240);
    border: 1px solid #515a6e;
    border-radius: 36px;
    cursor: pointer;
    position: relative;
    z-index: 10;
  }

  .pipeline-job-stage-step-content-add {
    /*min-width: 100px;*/
    width: 80%;
    background-color: rgb(240, 240, 240);
    border: 1px dashed #515a6e;
    border-radius: 36px;
    cursor: pointer;
    position: relative;
    z-index: 10;
  }

  .step-content {
    background: #fff;
    /*border: 1px solid #e5e5e5;*/
    border-radius: 36px;
    height: 28px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    cursor: pointer;
  }

  .pipeline-job-stage-title {
    margin: 20px 20px;
    position: relative;
    z-index: 10;
    cursor: unset;
  }

  .pipeline-job-split {
    width: 20%;
    float: left;
    height: 745px;
    text-align: center;
  }

  .pipeline-job-add-btn:before {
    content: "";
    height: 100%;
    border-left: 1px solid #d9d9d9;
    position: absolute;
    z-index: 10;
  }

  .pipeline-job-add-btn:after {
    content: "";
    width: 100%;
    border-top: 1px solid #d9d9d9;
    position: absolute;
    margin-left: -50%;
    top: 77.5px;
  }

  .pipeline-job-add-btn {
    position: relative;
    cursor: pointer;
    color: #8c8c8c;
    height: 100%;
    z-index: 10;
  }

  .pipeline-job-add-btn-first:before {
    content: "";
    height: 100%;
    border-left: 1px solid #d9d9d9;
    position: absolute;
    z-index: 10;
  }

  .pipeline-job-add-btn-first:after {
    content: "";
    width: 50%;
    border-top: 1px solid #d9d9d9;
    position: absolute;
    top: 77.5px;
  }

  .pipeline-job-add-btn-first {
    position: relative;
    cursor: pointer;
    color: #8c8c8c;
    height: 100%;
    z-index: 10;
  }

  .pipeline-job-add-icon {
    position: absolute;
    top: 67.5px;
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

  .pipeline-job-svg {
    /*width: 2000px;*/
    position: absolute;
    top: 0;
    left: 0;
    height: 745px;
    float: left;
    background-color: rgba(240, 240, 240, .0);
    z-index: 0;
  }

  .pipeline-job-body {
    position: absolute;
    top: 0;
    left: 0;
    height: 745px;
    width: auto;
    float: left;
    background-color: rgba(240, 240, 240, .0);
    z-index: 0;
  }

  .pipeline-job-path {
    z-index: 20;
    cursor: pointer;
    padding: 10px 0;
  }

  .pipeline-job-add {
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
  }

  .step-add-h {
    margin: 5px 0;
    font-weight: unset;
    display: inline-block;
  }

  .pipeline-job-stage-step-content:hover {
    color: #2d8cf0;
    border: 1px solid #2d8cf0;
  }

</style>
