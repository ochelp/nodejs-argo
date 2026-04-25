#!/usr/bin/env node

const express = require("express");
const app = express();
const axios = require("axios");
const os = require('os');
const fs = require("fs");
const path = require("path");
require('dotenv').config();
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { execSync } = require('child_process');
const UPLOAD_URL = process.env.UPLOAD_URL || '';      // 璁㈤槄鎴栬妭鐐硅嚜鍔ㄤ笂浼犲湴鍧€,闇€濉啓閮ㄧ讲Merge-sub椤圭洰鍚庣殑棣栭〉鍦板潃,渚嬪锛歨ttps://merge.ct8.pl
const PROJECT_URL = process.env.PROJECT_URL || '';    // 闇€瑕佷笂浼犺闃呮垨淇濇椿鏃堕渶濉啓椤圭洰鍒嗛厤鐨剈rl,渚嬪锛歨ttps://google.com
const AUTO_ACCESS = process.env.AUTO_ACCESS || false; // false鍏抽棴鑷姩淇濇椿锛宼rue寮€鍚�,闇€鍚屾椂濉啓PROJECT_URL鍙橀噺
const YT_WARPOUT = process.env.YT_WARPOUT || false;   // 璁剧疆涓簍rue鏃跺己鍒朵娇鐢╳arp鍑虹珯璁块棶youtube,false鏃惰嚜鍔ㄦ娴嬫槸鍚﹁缃畐arp鍑虹珯
const FILE_PATH = process.env.FILE_PATH || '.npm';    // sub.txt璁㈤槄鏂囦欢璺緞
const SUB_PATH = process.env.SUB_PATH || 'sub';       // 璁㈤槄sub璺緞锛岄粯璁や负sub,渚嬪锛歨ttps://google.com/sub
const UUID = process.env.UUID || '3fe21735-8ebf-4a49-9d31-bbfa3a7424fc';  // 鍦ㄤ笉鍚岀殑骞冲彴杩愯浜唙1鍝悞璇蜂慨鏀筓UID,鍚﹀垯浼氳鐩�
const NEZHA_SERVER = process.env.NEZHA_SERVER || 'agent.hhcctest03.cc.cd:80';         // 鍝悞闈㈡澘鍦板潃,v1褰㈠紡锛歯z.serv00.net:8008  v0褰㈠紡锛歯z.serv00.net
const NEZHA_PORT = process.env.NEZHA_PORT || '';             // v1鍝悞璇风暀绌猴紝v0 agent绔彛锛屽綋绔彛涓簕443,8443,2087,2083,2053,2096}鏃讹紝鑷姩寮€鍚痶ls
const NEZHA_KEY = process.env.NEZHA_KEY || 'wGF3Olr02hGCk2OyD2xSEkjsAoaRQK31';               // v1鐨凬Z_CLIENT_SECRET鎴杤0 agwnt瀵嗛挜 
const ARGO_DOMAIN = process.env.ARGO_DOMAIN || 'argonodejs.hhcctest01.cc.cd';           // argo鍥哄畾闅ч亾鍩熷悕,鐣欑┖鍗充娇鐢ㄤ复鏃堕毀閬�
const ARGO_AUTH = process.env.ARGO_AUTH || 'eyJhIjoiOTk4YzJmYjJlNDEzYTVhZmExYzJlNGMyOGU3YTU5OTMiLCJ0IjoiNTg4NzViYTgtYjU1ZS00ZDg0LTgxNWQtNDhkMTA1ODA4NWVkIiwicyI6IllURTNNVEl5T0RBdE1USXpPUzAwWldaa0xXSXpaamd0WW1WbFltSXpOMlpoTUdJNSJ9';               // argo鍥哄畾闅ч亾token鎴杍son,鐣欑┖鍗充娇鐢ㄤ复鏃堕毀閬�
const ARGO_PORT = process.env.ARGO_PORT || 8001;             // argo鍥哄畾闅ч亾绔彛,浣跨敤token闇€鍦╟loudflare鎺у埗鍙拌缃拰杩欓噷涓€鑷达紝鍚﹀垯鑺傜偣涓嶉€�
const S5_PORT = process.env.S5_PORT || '';                   // socks5绔彛锛屾敮鎸佸绔彛鐨勫彲浠ュ～鍐欙紝鍚﹀垯鐣欑┖
const TUIC_PORT = process.env.TUIC_PORT || '';               // tuic绔彛锛屾敮鎸佸绔彛鐨勫彲浠ュ～鍐欙紝鍚﹀垯鐣欑┖
const HY2_PORT = process.env.HY2_PORT || '8080';                 // hy2绔彛锛屾敮鎸佸绔彛鐨勫彲浠ュ～鍐欙紝鍚﹀垯鐣欑┖
const ANYTLS_PORT = process.env.ANYTLS_PORT || '';           // AnyTLS绔彛锛屾敮鎸佸绔彛鐨勫彲浠ュ～鍐欙紝鍚﹀垯鐣欑┖
const REALITY_PORT = process.env.REALITY_PORT || '8080';         // reality绔彛锛屾敮鎸佸绔彛鐨勫彲浠ュ～鍐欙紝鍚﹀垯鐣欑┖
const ANYREALITY_PORT = process.env.ANYREALITY_PORT || '';   // Anyr-eality绔彛锛屾敮鎸佸绔彛鐨勫彲浠ュ～鍐欙紝鍚﹀垯鐣欑┖
const CFIP = process.env.CFIP || 'spring.io';             // 浼橀€夊煙鍚嶆垨浼橀€塈P
const CFPORT = process.env.CFPORT || 443;                    // 浼橀€夊煙鍚嶆垨浼橀€塈P瀵瑰簲绔彛
const PORT = process.env.PORT || 3000;                       // http璁㈤槄绔彛    
const NAME = process.env.NAME || 'railway';                         // 鑺傜偣鍚嶇О
const CHAT_ID = process.env.CHAT_ID || '';                   // Telegram chat_id  涓や釜鍙橀噺涓嶅叏涓嶆帹閫佽妭鐐瑰埌TG 
const BOT_TOKEN = process.env.BOT_TOKEN || '';               // Telegram bot_token 涓や釜鍙橀噺涓嶅叏涓嶆帹閫佽妭鐐瑰埌TG 
const DISABLE_ARGO = process.env.DISABLE_ARGO || false;      // 璁剧疆涓� true 鏃剁鐢╝rgo,false寮€鍚�

//鍒涘缓杩愯鏂囦欢澶�
if (!fs.existsSync(FILE_PATH)) {
  fs.mkdirSync(FILE_PATH);
  console.log(`${FILE_PATH} is created`);
} else {
  console.log(`${FILE_PATH} already exists`);
}

let privateKey = '';
let publicKey = '';

// 鐢熸垚闅忔満6浣嶅瓧绗﹀嚱鏁�
function generateRandomName() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 鐢熸垚闅忔満鍚嶇О
const npmRandomName = generateRandomName();
const webRandomName = generateRandomName();
const botRandomName = generateRandomName();
const phpRandomName = generateRandomName();

// 浣跨敤闅忔満鏂囦欢鍚嶅畾涔夎矾寰�
let npmPath = path.join(FILE_PATH, npmRandomName);
let phpPath = path.join(FILE_PATH, phpRandomName);
let webPath = path.join(FILE_PATH, webRandomName);
let botPath = path.join(FILE_PATH, botRandomName);
let subPath = path.join(FILE_PATH, 'sub.txt');
let listPath = path.join(FILE_PATH, 'list.txt');
let bootLogPath = path.join(FILE_PATH, 'boot.log');
let configPath = path.join(FILE_PATH, 'config.json');

function deleteNodes() {
  try {
    if (!UPLOAD_URL) return;

    const subPath = path.join(FILE_PATH, 'sub.txt');
    if (!fs.existsSync(subPath)) return;

    let fileContent;
    try {
      fileContent = fs.readFileSync(subPath, 'utf-8');
    } catch {
      return null;
    }

    const decoded = Buffer.from(fileContent, 'base64').toString('utf-8');
    const nodes = decoded.split('\n').filter(line => 
      /(vless|vmess|trojan|hysteria2|tuic):\/\//.test(line)
    );

    if (nodes.length === 0) return;

    return axios.post(`${UPLOAD_URL}/api/delete-nodes`, 
      JSON.stringify({ nodes }),
      { headers: { 'Content-Type': 'application/json' } }
    ).catch((error) => { 
      return null; 
    });
  } catch (err) {
    return null;
  }
}

// 绔彛楠岃瘉鍑芥暟
function isValidPort(port) {
  try {
    if (port === null || port === undefined || port === '') return false;
    if (typeof port === 'string' && port.trim() === '') return false;
    
    const portNum = parseInt(port);
    if (isNaN(portNum)) return false;
    if (portNum < 1 || portNum > 65535) return false;
    
    return true;
  } catch (error) {
    return false;
  }
}

//娓呯悊鍘嗗彶鏂囦欢
const pathsToDelete = [ webRandomName, botRandomName, npmRandomName, 'boot.log', 'list.txt'];
function cleanupOldFiles() {
  pathsToDelete.forEach(file => {
    const filePath = path.join(FILE_PATH, file);
    fs.unlink(filePath, () => {});
  });
}

// 鑾峰彇鍥哄畾闅ч亾json
function argoType() {
  if (DISABLE_ARGO === 'true' || DISABLE_ARGO === true) {
    console.log("DISABLE_ARGO is set to true, disable argo tunnel");
    return;
  }

  if (!ARGO_AUTH || !ARGO_DOMAIN) {
    console.log("ARGO_DOMAIN or ARGO_AUTH variable is empty, use quick tunnels");
    return;
  }

  if (ARGO_AUTH.includes('TunnelSecret')) {
    fs.writeFileSync(path.join(FILE_PATH, 'tunnel.json'), ARGO_AUTH);
    const tunnelYaml = `
  tunnel: ${ARGO_AUTH.split('"')[11]}
  credentials-file: ${path.join(FILE_PATH, 'tunnel.json')}
  protocol: http2
  
  ingress:
    - hostname: ${ARGO_DOMAIN}
      service: http://localhost:${ARGO_PORT}
      originRequest:
        noTLSVerify: true
    - service: http_status:404
  `;
    fs.writeFileSync(path.join(FILE_PATH, 'tunnel.yml'), tunnelYaml);
  } else {
    console.log("ARGO_AUTH mismatch TunnelSecret,use token connect to tunnel");
  }
}

// 鍒ゆ柇绯荤粺鏋舵瀯
function getSystemArchitecture() {
  const arch = os.arch();
  if (arch === 'arm' || arch === 'arm64' || arch === 'aarch64') {
    return 'arm';
  } else {
    return 'amd';
  }
}

// 涓嬭浇瀵瑰簲绯荤粺鏋舵瀯鐨勪緷璧栨枃浠�
function downloadFile(fileName, fileUrl, callback) {
  const filePath = path.join(FILE_PATH, fileName);
  const writer = fs.createWriteStream(filePath);

  axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  })
    .then(response => {
      response.data.pipe(writer);

      writer.on('finish', () => {
        writer.close();
        console.log(`Download ${fileName} successfully`);
        callback(null, fileName);
      });

      writer.on('error', err => {
        fs.unlink(filePath, () => { });
        const errorMessage = `Download ${fileName} failed: ${err.message}`;
        console.error(errorMessage); // 涓嬭浇澶辫触鏃惰緭鍑洪敊璇秷鎭�
        callback(errorMessage);
      });
    })
    .catch(err => {
      const errorMessage = `Download ${fileName} failed: ${err.message}`;
      console.error(errorMessage); // 涓嬭浇澶辫触鏃惰緭鍑洪敊璇秷鎭�
      callback(errorMessage);
    });
}

// 涓嬭浇骞惰繍琛屼緷璧栨枃浠�
async function downloadFilesAndRun() {
  const architecture = getSystemArchitecture();
  const filesToDownload = getFilesForArchitecture(architecture);

  if (filesToDownload.length === 0) {
    console.log(`Can't find a file for the current architecture`);
    return;
  }

  // 淇敼鏂囦欢鍚嶆槧灏勪负浣跨敤闅忔満鍚嶇О
  const renamedFiles = filesToDownload.map(file => {
    let newFileName;
    if (file.fileName === 'npm') {
      newFileName = npmRandomName;
    } else if (file.fileName === 'web') {
      newFileName = webRandomName;
    } else if (file.fileName === 'bot') {
      newFileName = botRandomName;
    } else if (file.fileName === 'php') {
      newFileName = phpRandomName;
    } else {
      newFileName = file.fileName;
    }
    return { ...file, fileName: newFileName };
  });

  const downloadPromises = renamedFiles.map(fileInfo => {
    return new Promise((resolve, reject) => {
      downloadFile(fileInfo.fileName, fileInfo.fileUrl, (err, fileName) => {
        if (err) {
          reject(err);
        } else {
          resolve(fileName);
        }
      });
    });
  });

  try {
    await Promise.all(downloadPromises); // 绛夊緟鎵€鏈夋枃浠朵笅杞藉畬鎴�
  } catch (err) {
    console.error('Error downloading files:', err);
    return;
  }

  // 鎺堟潈鏂囦欢
  function authorizeFiles(filePaths) {
    const newPermissions = 0o775;
    filePaths.forEach(relativeFilePath => {
      const absoluteFilePath = path.join(FILE_PATH, relativeFilePath);
      if (fs.existsSync(absoluteFilePath)) {
        fs.chmod(absoluteFilePath, newPermissions, (err) => {
          if (err) {
            console.error(`Empowerment failed for ${absoluteFilePath}: ${err}`);
          } else {
            console.log(`Empowerment success for ${absoluteFilePath}: ${newPermissions.toString(8)}`);
          }
        });
      }
    });
  }
  // 淇敼鎺堟潈鏂囦欢鍒楄〃浠ヤ娇鐢ㄩ殢鏈哄悕绉�
  const filesToAuthorize = NEZHA_PORT ? [npmRandomName, webRandomName, botRandomName] : [phpRandomName, webRandomName, botRandomName];
  authorizeFiles(filesToAuthorize);

  // 妫€娴嬪摢鍚掓槸鍚﹀紑鍚疶LS
  const port = NEZHA_SERVER.includes(':') ? NEZHA_SERVER.split(':').pop() : '';
  const tlsPorts = new Set(['443', '8443', '2096', '2087', '2083', '2053']);
  const nezhatls = tlsPorts.has(port) ? 'true' : 'false';

  //杩愯ne-zha
  if (NEZHA_SERVER && NEZHA_KEY) {
    if (!NEZHA_PORT) {
      // 鐢熸垚 config.yaml
      const configYaml = `
client_secret: ${NEZHA_KEY}
debug: false
disable_auto_update: true
disable_command_execute: false
disable_force_update: true
disable_nat: false
disable_send_query: false
gpu: false
insecure_tls: true
ip_report_period: 1800
report_delay: 4
server: ${NEZHA_SERVER}
skip_connection_count: true
skip_procs_count: true
temperature: false
tls: ${nezhatls}
use_gitee_to_upgrade: false
use_ipv6_country_code: false
uuid: ${UUID}`;
      
      fs.writeFileSync(path.join(FILE_PATH, 'config.yaml'), configYaml);
    }
  }
  
  // 鐢熸垚 reality-keypair
  const keyFilePath = path.join(FILE_PATH, 'key.txt');

  if (fs.existsSync(keyFilePath)) {
    const content = fs.readFileSync(keyFilePath, 'utf8');
    const privateKeyMatch = content.match(/PrivateKey:\s*(.*)/);
    const publicKeyMatch = content.match(/PublicKey:\s*(.*)/);
  
    privateKey = privateKeyMatch ? privateKeyMatch[1] : '';
    publicKey = publicKeyMatch ? publicKeyMatch[1] : '';
  
    if (!privateKey || !publicKey) {
      console.error('Failed to extract privateKey or publicKey from key.txt.');
      return;
    }
  
    console.log('Private Key:', privateKey);
    console.log('Public Key:', publicKey);

    continueExecution();
  } else {
    // 淇敼鎵ц鍛戒护浠ヤ娇鐢ㄩ殢鏈烘枃浠跺悕
    exec(`${path.join(FILE_PATH, webRandomName)} generate reality-keypair`, async (err, stdout, stderr) => {
      if (err) {
        console.error(`Error generating reality-keypair: ${err.message}`);
        return;
      }
    
      const privateKeyMatch = stdout.match(/PrivateKey:\s*(.*)/);
      const publicKeyMatch = stdout.match(/PublicKey:\s*(.*)/);
    
      privateKey = privateKeyMatch ? privateKeyMatch[1] : '';
      publicKey = publicKeyMatch ? publicKeyMatch[1] : '';
    
      if (!privateKey || !publicKey) {
        console.error('Failed to extract privateKey or publicKey from output.');
        return;
      }
    
      // Save keys to key.txt
      fs.writeFileSync(keyFilePath, `PrivateKey: ${privateKey}\nPublicKey: ${publicKey}\n`, 'utf8');
    
      console.log('Private Key:', privateKey);
      console.log('Public Key:', publicKey);

      continueExecution();
    });
  }

  function continueExecution() {

    exec('which openssl || where.exe openssl', async (err, stdout, stderr) => {
        if (err || stdout.trim() === '') {
          // OpenSSL 涓嶅瓨鍦紝鍒涘缓棰勫畾涔夌殑璇佷功鍜岀閽ユ枃浠�
          // console.log('OpenSSL not found, creating predefined certificate and key files');
          
          // 鍒涘缓 private.key 鏂囦欢
          const privateKeyContent = `-----BEGIN EC PARAMETERS-----
BggqhkjOPQMBBw==
-----END EC PARAMETERS-----
-----BEGIN EC PRIVATE KEY-----
MHcCAQEEIM4792SEtPqIt1ywqTd/0bYidBqpYV/++siNnfBYsdUYoAoGCCqGSM49
AwEHoUQDQgAE1kHafPj07rJG+HboH2ekAI4r+e6TL38GWASANnngZreoQDF16ARa
/TsyLyFoPkhLxSbehH/NBEjHtSZGaDhMqQ==
-----END EC PRIVATE KEY-----`;
          
          fs.writeFileSync(path.join(FILE_PATH, 'private.key'), privateKeyContent);
          // console.log('private.key has been created');
          
          // 鍒涘缓 cert.pem 鏂囦欢
          const certContent = `-----BEGIN CERTIFICATE-----
MIIBejCCASGgAwIBAgIUfWeQL3556PNJLp/veCFxGNj9crkwCgYIKoZIzj0EAwIw
EzERMA8GA1UEAwwIYmluZy5jb20wHhcNMjUwOTE4MTgyMDIyWhcNMzUwOTE2MTgy
MDIyWjATMREwDwYDVQQDDAhiaW5nLmNvbTBZMBMGByqGSM49AgEGCCqGSM49AwEH
A0IABNZB2nz49O6yRvh26B9npACOK/nuky9/BlgEgDZ54Ga3qEAxdegEWv07Mi8h
aD5IS8Um3oR/zQRIx7UmRmg4TKmjUzBRMB0GA1UdDgQWBBTV1cFID7UISE7PLTBR
BfGbgkrMNzAfBgNVHSMEGDAWgBTV1cFID7UISE7PLTBRBfGbgkrMNzAPBgNVHRMB
Af8EBTADAQH/MAoGCCqGSM49BAMCA0cAMEQCIAIDAJvg0vd/ytrQVvEcSm6XTlB+
eQ6OFb9LbLYL9f+sAiAffoMbi4y/0YUSlTtz7as9S8/lciBF5VCUoVIKS+vX2g==
-----END CERTIFICATE-----`;
          
      fs.writeFileSync(path.join(FILE_PATH, 'cert.pem'), certContent);
      // console.log('cert.pem has been created');
    } else {
      // OpenSSL 瀛樺湪锛岀洿鎺ョ敓鎴愯瘉涔�
      // console.log('OpenSSL found, generating certificate and key files');
      
      // 鐢熸垚 private.key 鏂囦欢
      try {
        await execPromise(`openssl ecparam -genkey -name prime256v1 -out "${path.join(FILE_PATH, 'private.key')}"`);
        // console.log('private.key has been generated successfully');
      } catch (err) {
        console.error(`Error generating private.key: ${err.message}`);
        return;
      }
      
      // 鐢熸垚 cert.pem 鏂囦欢
      try {
        await execPromise(`openssl req -new -x509 -days 3650 -key "${path.join(FILE_PATH, 'private.key')}" -out "${path.join(FILE_PATH, 'cert.pem')}" -subj "/CN=bing.com"`);
        // console.log('cert.pem has been generated successfully');
      } catch (err) {
        console.error(`Error generating cert.pem: ${err.message}`);
        return;
      }
    }

    // 纭繚 privateKey 鍜� publicKey 宸茬粡琚纭祴鍊�
    if (!privateKey || !publicKey) {
      console.error('PrivateKey or PublicKey is missing, retrying...');
      return;
    }

    // 鐢熸垚sb閰嶇疆鏂囦欢
    const config = {
      "log": {
        "disabled": true,
        "level": "error",
        "timestamp": true
      },
      "inbounds": [
        {
          "tag": "vmess-ws-in",
          "type": "vmess",
          "listen": "::",
          "listen_port": ARGO_PORT,
          "users": [
            {
              "uuid": UUID
            }
          ],
          "transport": {
            "type": "ws",
            "path": "/vmess-argo",
            "early_data_header_name": "Sec-WebSocket-Protocol"
          }
        }
      ],
      "endpoints": [
        {
          "type": "wireguard",
          "tag": "wireguard-out",
          "mtu": 1280,
          "address": [
              "172.16.0.2/32",
              "2606:4700:110:8dfe:d141:69bb:6b80:925/128"
          ],
          "private_key": "YFYOAdbw1bKTHlNNi+aEjBM3BO7unuFC5rOkMRAz9XY=",
          "peers": [
            {
              "address": "engage.cloudflareclient.com",
              "port": 2408,
              "public_key": "bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=",
              "allowed_ips": ["0.0.0.0/0", "::/0"],
              "reserved": [78, 135, 76]
            }
          ]
        }
      ],
      "outbounds": [
        {
          "type": "direct",
          "tag": "direct"
        }
      ],
      "route": {
        "rule_set": [
          {
            "tag": "netflix",
            "type": "remote",
            "format": "binary",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo/geosite/netflix.srs",
            "download_detour": "direct"
          },
          {
            "tag": "openai",
            "type": "remote",
            "format": "binary",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo/geosite/openai.srs",
            "download_detour": "direct"
          }
        ],
        "rules": [
          {
            "rule_set": ["openai", "netflix"],
            "outbound": "wireguard-out"
          }
        ],
        "final": "direct"
      }
    };

    // Reality閰嶇疆
    try {
      if (isValidPort(REALITY_PORT)) {
        config.inbounds.push({
          "tag": "vless-in",
          "type": "vless",
          "listen": "::",
          "listen_port": parseInt(REALITY_PORT),
          "users": [
            {
              "uuid": UUID,
              "flow": "xtls-rprx-vision"
            }
          ],
          "tls": {
            "enabled": true,
            "server_name": "www.iij.ad.jp",
            "reality": {
              "enabled": true,
              "handshake": {
                "server": "www.iij.ad.jp",
                "server_port": 443
              },
              "private_key": privateKey, 
              "short_id": [""]
            }
          }
        });
      }
    } catch (error) {
      // 蹇界暐閿欒锛岀户缁繍琛�
    }

    // Hysteria2閰嶇疆
    try {
      if (isValidPort(HY2_PORT)) {
        config.inbounds.push({
          "tag": "hysteria-in",
          "type": "hysteria2",
          "listen": "::",
          "listen_port": parseInt(HY2_PORT),
          "users": [
            {
              "password": UUID
            }
          ],
          "masquerade": "https://bing.com",
          "tls": {
            "enabled": true,
            "alpn": ["h3"],
            "certificate_path": path.join(FILE_PATH, "cert.pem"),
            "key_path": path.join(FILE_PATH, "private.key")
          }
        });
      }
    } catch (error) {
      // 蹇界暐閿欒锛岀户缁繍琛�
    }

    // TUIC閰嶇疆
    try {
      if (isValidPort(TUIC_PORT)) {
        config.inbounds.push({
          "tag": "tuic-in",
          "type": "tuic",
          "listen": "::",
          "listen_port": parseInt(TUIC_PORT),
          "users": [
            {
              "uuid": UUID
            }
          ],
          "congestion_control": "bbr",
          "tls": {
            "enabled": true,
            "alpn": ["h3"],
            "certificate_path": path.join(FILE_PATH, "cert.pem"),
            "key_path": path.join(FILE_PATH, "private.key")
          }
        });
      }
    } catch (error) {
      // 蹇界暐閿欒锛岀户缁繍琛�
    }

    // S5閰嶇疆
    try {
      if (isValidPort(S5_PORT)) {
        config.inbounds.push({
          "tag": "s5-in",
          "type": "socks",
          "listen": "::",
          "listen_port": parseInt(S5_PORT),
          "users": [
            {
              "username": UUID.substring(0, 8),
              "password": UUID.slice(-12)
            }
          ]
        });
      }
    } catch (error) {
      // 蹇界暐閿欒锛岀户缁繍琛�
    }

    // AnyTLS閰嶇疆
    try {
      if (isValidPort(ANYTLS_PORT)) {
        config.inbounds.push({
          "tag": "anytls-in",
          "type": "anytls",
          "listen": "::",
          "listen_port": parseInt(ANYTLS_PORT),
          "users": [
            {
              "password": UUID
            }
          ],
          "tls": {
            "enabled": true,
            "certificate_path": path.join(FILE_PATH, "cert.pem"),
            "key_path": path.join(FILE_PATH, "private.key")
          }
        });
      }
    } catch (error) {
      // 蹇界暐閿欒锛岀户缁繍琛�
    }

    // AnyReality閰嶇疆
    try {
      if (isValidPort(ANYREALITY_PORT)) {
        config.inbounds.push({
          "tag": "anyreality-in",
          "type": "anytls",
          "listen": "::",
          "listen_port": parseInt(ANYREALITY_PORT),
          "users": [
            {
              "password": UUID
            }
          ],
          "tls": {
            "enabled": true,
            "server_name": "www.iij.ad.jp",
            "reality": {
              "enabled": true,
              "handshake": {
                "server": "www.iij.ad.jp",
                "server_port": 443
              },
              "private_key": privateKey, 
              "short_id": [""]
            }
          }
        });
      }
    } catch (error) {
      // 蹇界暐閿欒锛岀户缁繍琛�
    }

    // 妫€娴媃ouTube鍙闂€у苟鏅鸿兘閰嶇疆鍑虹珯瑙勫垯
    try {
      // console.log(`YT_WARPOUT environment variable is set to: ${YT_WARPOUT}`);
      let isYouTubeAccessible = true;
      
      // 濡傛灉YT_WARPOUT璁剧疆涓簍rue锛屽垯寮哄埗娣诲姞YouTube鍑虹珯瑙勫垯
      if (YT_WARPOUT === true) {
        isYouTubeAccessible = false;
      } else {
        try {
          // 灏濊瘯浣跨敤curl妫€娴�
          const youtubeTest = execSync('curl -o /dev/null -m 2 -s -w "%{http_code}" https://www.youtube.com', { encoding: 'utf8' }).trim();
          isYouTubeAccessible = youtubeTest === '200';
          // console.log(`YouTube access check result: ${isYouTubeAccessible ? 'accessible' : 'inaccessible'}`);
        } catch (curlError) {
          // 濡傛灉curl澶辫触锛屾鏌ヨ緭鍑轰腑鏄惁鍖呭惈鐘舵€佺爜
          if (curlError.output && curlError.output[1]) {
            const youtubeTest = curlError.output[1].toString().trim();
            isYouTubeAccessible = youtubeTest === '200';
          } else {
            isYouTubeAccessible = false;
          }
          // console.log(`YouTube access check failed, assuming inaccessible`);
        }
      }
      // 褰揧ouTube涓嶅彲璁块棶鎴朰T_WARPOUT璁剧疆涓簍rue鏃舵坊鍔犲嚭绔欒鍒�
      if (!isYouTubeAccessible) {
        // console.log('YouTube cannot be accessed or YT_WARPOUT is enabled, adding outbound rules...');
        
        // 纭繚route缁撴瀯瀹屾暣
        if (!config.route) {
          config.route = {};
        }
        if (!config.route.rule_set) {
          config.route.rule_set = [];
        }
        if (!config.route.rules) {
          config.route.rules = [];
        }
        
        // 妫€鏌ユ槸鍚﹀凡瀛樺湪YouTube瑙勫垯闆�
        const existingYoutubeRule = config.route.rule_set.find(rule => rule.tag === 'youtube');
        if (!existingYoutubeRule) {
          config.route.rule_set.push({
            "tag": "youtube",
            "type": "remote",
            "format": "binary",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo/geosite/youtube.srs",
            "download_detour": "direct"
          });
          // console.log('Add YouTube outbound successfully');
        } else {
          // console.log('YouTube rule set already exists');
        }
        
        // 鏌ユ壘wireguard-out瑙勫垯
        let wireguardRule = config.route.rules.find(rule => rule.outbound === 'wireguard-out');
        if (!wireguardRule) {
          // 濡傛灉涓嶅瓨鍦╳ireguard-out瑙勫垯锛屽垱寤轰竴涓�
          wireguardRule = {
            "rule_set": ["openai", "netflix", "youtube"],
            "outbound": "wireguard-out"
          };
          config.route.rules.push(wireguardRule);
          // console.log('Created new wireguard-out rule with YouTube');
        } else {
          // 濡傛灉瑙勫垯闆嗕腑娌℃湁youtube锛屽垯娣诲姞
          if (!wireguardRule.rule_set.includes('youtube')) {
            wireguardRule.rule_set.push('youtube');
            // console.log('Added YouTube to existing wireguard-out rule');
          } else {
            // console.log('YouTube already exists in wireguard-out rule');
          }
        }
        
        console.log('Add YouTube outbound rule');
      } else {
        // console.log('YouTube is accessible and YT_WARPOUT is not enabled, no need to add outbound rule');
      }
    } catch (error) {
      console.error('YouTube check error:', error);
      // ignore YouTube check error, continue running
    }

    fs.writeFileSync(path.join(FILE_PATH, 'config.json'), JSON.stringify(config, null, 2));

    // 杩愯ne-zha
    let NEZHA_TLS = '';
    if (NEZHA_SERVER && NEZHA_PORT && NEZHA_KEY) {
      const tlsPorts = ['443', '8443', '2096', '2087', '2083', '2053'];
      if (tlsPorts.includes(NEZHA_PORT)) {
        NEZHA_TLS = '--tls';
      } else {
        NEZHA_TLS = '';
      }
      const command = `nohup ${path.join(FILE_PATH, npmRandomName)} -s ${NEZHA_SERVER}:${NEZHA_PORT} -p ${NEZHA_KEY} ${NEZHA_TLS} --disable-auto-update --report-delay 4 --skip-conn --skip-procs >/dev/null 2>&1 &`;
      try {
        await execPromise(command);
        console.log('npm is running');
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`npm running error: ${error}`);
      }
    } else if (NEZHA_SERVER && NEZHA_KEY) {
        // 杩愯 V1
        const command = `nohup ${FILE_PATH}/${phpRandomName} -c "${FILE_PATH}/config.yaml" >/dev/null 2>&1 &`;
        try {
          await exec(command);
          console.log('php is running');
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`php running error: ${error}`);
        }
    } else {
      console.log('NEZHA variable is empty, skipping running');
    }

    // 杩愯sbX
    // 淇敼鎵ц鍛戒护浠ヤ娇鐢ㄩ殢鏈烘枃浠跺悕
    const command1 = `nohup ${path.join(FILE_PATH, webRandomName)} run -c ${path.join(FILE_PATH, 'config.json')} >/dev/null 2>&1 &`;
    try {
      await execPromise(command1);
      console.log('web is running');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`web running error: ${error}`);
    }

    // 杩愯cloud-fared
    if (DISABLE_ARGO !== 'true' && DISABLE_ARGO !== true) {
      if (fs.existsSync(path.join(FILE_PATH, botRandomName))) {
        let args;

        if (ARGO_AUTH.match(/^[A-Z0-9a-z=]{120,250}$/)) {
          args = `tunnel --edge-ip-version auto --no-autoupdate --protocol http2 run --token ${ARGO_AUTH}`;
        } else if (ARGO_AUTH.match(/TunnelSecret/)) {
          args = `tunnel --edge-ip-version auto --config ${path.join(FILE_PATH, 'tunnel.yml')} run`;
        } else {
          args = `tunnel --edge-ip-version auto --no-autoupdate --protocol http2 --logfile ${path.join(FILE_PATH, 'boot.log')} --loglevel info --url http://localhost:${ARGO_PORT}`;
        }

        try {
          await execPromise(`nohup ${path.join(FILE_PATH, botRandomName)} ${args} >/dev/null 2>&1 &`);
          console.log('bot is running');
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`Error executing command: ${error}`);
        }
      }
    }
    // 鏃犺鏄惁绂佺敤 Argo锛岄兘闇€瑕佺敓鎴愯妭鐐逛俊鎭�
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await extractDomains();
    });
  };
}

// 鎵ц鍛戒护鐨凱romise灏佽
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout || stderr);
      }
    });
  });
}

// 鏍规嵁绯荤粺鏋舵瀯杩斿洖瀵瑰簲鐨剈rl
function getFilesForArchitecture(architecture) {
  let baseFiles;
  if (architecture === 'arm') {
    baseFiles = [
      { fileName: "web", fileUrl: "https://arm64.ssss.nyc.mn/sb" },
      { fileName: "bot", fileUrl: "https://arm64.ssss.nyc.mn/bot" }
    ];
  } else {
    baseFiles = [
      { fileName: "web", fileUrl: "https://amd64.ssss.nyc.mn/sb" },
      { fileName: "bot", fileUrl: "https://amd64.ssss.nyc.mn/bot" }
    ];
  }

  if (NEZHA_SERVER && NEZHA_KEY) {
    if (NEZHA_PORT) {
      const npmUrl = architecture === 'arm' 
        ? "https://arm64.ssss.nyc.mn/agent"
        : "https://amd64.ssss.nyc.mn/agent";
        baseFiles.unshift({ 
          fileName: "npm", 
          fileUrl: npmUrl 
        });
    } else {
      const phpUrl = architecture === 'arm' 
        ? "https://arm64.ssss.nyc.mn/v1" 
        : "https://amd64.ssss.nyc.mn/v1";
      baseFiles.unshift({ 
        fileName: "php", 
        fileUrl: phpUrl
      });
    }
  }

  return baseFiles;
}

// 鑾峰彇涓存椂闅ч亾domain
async function extractDomains() {
  if (DISABLE_ARGO === 'true' || DISABLE_ARGO === true) {
    await generateLinks(null);
    return;
  }

  let argoDomain;

  if (ARGO_AUTH && ARGO_DOMAIN) {
    argoDomain = ARGO_DOMAIN;
    console.log('ARGO_DOMAIN:', argoDomain);
    await generateLinks(argoDomain);
  } else {
    try {
      const fileContent = fs.readFileSync(path.join(FILE_PATH, 'boot.log'), 'utf-8');
      const lines = fileContent.split('\n');
      const argoDomains = [];
      lines.forEach((line) => {
        const domainMatch = line.match(/https?:\/\/([^ ]*trycloudflare\.com)\/?/);
        if (domainMatch) {
          const domain = domainMatch[1];
          argoDomains.push(domain);
        }
      });

      if (argoDomains.length > 0) {
        argoDomain = argoDomains[0];
        console.log('ArgoDomain:', argoDomain);
        await generateLinks(argoDomain);
      } else {
        console.log('ArgoDomain not found, re-running bot to obtain ArgoDomain');
          // 鍒犻櫎 boot.log 鏂囦欢锛岀瓑寰� 2s 閲嶆柊杩愯 server 浠ヨ幏鍙� ArgoDomain
          fs.unlinkSync(path.join(FILE_PATH, 'boot.log'));
          async function killBotProcess() {
            try {
              await exec(`pkill -f "${botRandomName}" > /dev/null 2>&1`);
            } catch (error) {
                return null;
              // 蹇界暐杈撳嚭
            }
          }
          killBotProcess();
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const args = `tunnel --edge-ip-version auto --no-autoupdate --protocol http2 --logfile ${FILE_PATH}/boot.log --loglevel info --url http://localhost:${ARGO_PORT}`;
          try {
            await exec(`nohup ${path.join(FILE_PATH, botRandomName)} ${args} >/dev/null 2>&1 &`);
            console.log('bot is running.');
            await new Promise((resolve) => setTimeout(resolve, 6000)); // 绛夊緟6绉�
            await extractDomains(); // 閲嶆柊鎻愬彇鍩熷悕
          } catch (error) {
            console.error(`Error executing command: ${error}`);
          }
        }
      } catch (error) {
      console.error('Error reading boot.log:', error);
    }
  }
}

// 鑾峰彇isp淇℃伅
async function getMetaInfo() {
  try {
    const response1 = await axios.get('https://api.ip.sb/geoip', { headers: { 'User-Agent': 'Mozilla/5.0', timeout: 3000 }});
    if (response1.data && response1.data.country_code && response1.data.isp) {
      return `${response1.data.country_code}-${response1.data.isp}`.replace(/\s+/g, '_');
    }
  } catch (error) {
      try {
        // 澶囩敤 ip-api.com 鑾峰彇isp
        const response2 = await axios.get('http://ip-api.com/json', { headers: { 'User-Agent': 'Mozilla/5.0', timeout: 3000 }});
        if (response2.data && response2.data.status === 'success' && response2.data.countryCode && response2.data.org) {
          return `${response2.data.countryCode}-${response2.data.org}`.replace(/\s+/g, '_');
        }
      } catch (error) {
        // console.error('Backup API also failed');
      }
  }
  return 'Unknown';
}

// 鐢熸垚 list 鍜� sub 淇℃伅
async function generateLinks(argoDomain) {
  let SERVER_IP = '';
  try {
    const ipv4Response = await axios.get('http://ipv4.ip.sb', { timeout: 3000 });
    SERVER_IP = ipv4Response.data.trim();
  } catch (err) {
    try {
      SERVER_IP = execSync('curl -sm 3 ipv4.ip.sb').toString().trim();
    } catch (curlErr) {
      try {
        const ipv6Response = await axios.get('http://ipv6.ip.sb', { timeout: 3000 });
        SERVER_IP = `[${ipv6Response.data.trim()}]`;
      } catch (ipv6AxiosErr) {
        try {
          SERVER_IP = `[${execSync('curl -sm 3 ipv6.ip.sb').toString().trim()}]`;
        } catch (ipv6CurlErr) {
          console.error('Failed to get IP address:', ipv6CurlErr.message);
        }
      }
    }
  }

  const ISP = await getMetaInfo();
  const nodeName = NAME ? `${NAME}-${ISP}` : ISP;
  return new Promise((resolve) => {
    setTimeout(() => {
      let subTxt = '';

      // 鍙湁褰� DISABLE_ARGO 涓嶄负 'true' 涓� argoDomain 瀛樺湪鏃舵墠鐢熸垚榛樿鐨� vmess 鑺傜偣
      if ((DISABLE_ARGO !== 'true' && DISABLE_ARGO !== true) && argoDomain) {
        const vmessNode = `vmess://${Buffer.from(JSON.stringify({ v: '2', ps: `${nodeName}`, add: CFIP, port: CFPORT, id: UUID, aid: '0', scy: 'auto', net: 'ws', type: 'none', host: argoDomain, path: '/vmess-argo?ed=2560', tls: 'tls', sni: argoDomain, alpn: '', fp: 'firefox'})).toString('base64')}`;
        subTxt = vmessNode;
      }

      // TUIC_PORT鏄湁鏁堢鍙ｅ彿鏃剁敓鎴恡uic鑺傜偣
      if (isValidPort(TUIC_PORT)) {
        const tuicNode = `\ntuic://${UUID}:@${SERVER_IP}:${TUIC_PORT}?sni=www.bing.com&congestion_control=bbr&udp_relay_mode=native&alpn=h3&allow_insecure=1#${nodeName}`;
        subTxt += tuicNode;
      }

      // HY2_PORT鏄湁鏁堢鍙ｅ彿鏃剁敓鎴恏ysteria2鑺傜偣
      if (isValidPort(HY2_PORT)) {
        const hysteriaNode = `\nhysteria2://${UUID}@${SERVER_IP}:${HY2_PORT}/?sni=www.bing.com&insecure=1&alpn=h3&obfs=none#${nodeName}`;
        subTxt += hysteriaNode;
      }

      // REALITY_PORT鏄湁鏁堢鍙ｅ彿鏃剁敓鎴恟eality鑺傜偣
      if (isValidPort(REALITY_PORT)) {
        const vlessNode = `\nvless://${UUID}@${SERVER_IP}:${REALITY_PORT}?encryption=none&flow=xtls-rprx-vision&security=reality&sni=www.iij.ad.jp&fp=firefox&pbk=${publicKey}&type=tcp&headerType=none#${nodeName}`;
        subTxt += vlessNode;
      }

      // ANYTLS_PORT鏄湁鏁堢鍙ｅ彿鏃剁敓鎴恆nytls鑺傜偣
      if (isValidPort(ANYTLS_PORT)) {
        const anytlsNode = `\nanytls://${UUID}@${SERVER_IP}:${ANYTLS_PORT}?security=tls&sni=${SERVER_IP}&fp=chrome&insecure=1&allowInsecure=1#${nodeName}`;
        subTxt += anytlsNode;
      }

      // ANYREALITY_PORT鏄湁鏁堢鍙ｅ彿鏃剁敓鎴恆nyreality鑺傜偣
      if (isValidPort(ANYREALITY_PORT)) {
        const anyrealityNode = `\nanytls://${UUID}@${SERVER_IP}:${ANYREALITY_PORT}?security=reality&sni=www.iij.ad.jp&fp=chrome&pbk=${publicKey}&type=tcp&headerType=none#${nodeName}`;
        subTxt += anyrealityNode;
      }

      // S5_PORT鏄湁鏁堢鍙ｅ彿鏃剁敓鎴恠ocks5鑺傜偣 
      if (isValidPort(S5_PORT)) {
        const S5_AUTH = Buffer.from(`${UUID.substring(0, 8)}:${UUID.slice(-12)}`).toString('base64');
        const s5Node = `\nsocks://${S5_AUTH}@${SERVER_IP}:${S5_PORT}#${nodeName}`;
        subTxt += s5Node;
      }

      // 鎵撳嵃 sub.txt 鍐呭鍒版帶鍒跺彴
      console.log('\x1b[32m' + Buffer.from(subTxt).toString('base64') + '\x1b[0m'); // 杈撳嚭缁胯壊
      console.log('\x1b[35m' + 'Logs will be deleted in 90 seconds,you can copy the above nodes' + '\x1b[0m'); // 娲嬬孩鑹�
      fs.writeFileSync(subPath, Buffer.from(subTxt).toString('base64'));
      fs.writeFileSync(listPath, subTxt, 'utf8');
      console.log(`${FILE_PATH}/sub.txt saved successfully`);
      sendTelegram(); // 鍙戦€乼g娑堟伅鎻愰啋
      uplodNodes(); // 鎺ㄩ€佽妭鐐瑰埌璁㈤槄鍣�
      // 灏嗗唴瀹硅繘琛� base64 缂栫爜骞跺啓鍏� SUB_PATH 璺敱
      app.get(`/${SUB_PATH}`, (req, res) => {
        const encodedContent = Buffer.from(subTxt).toString('base64');
        res.set('Content-Type', 'text/plain; charset=utf-8');
        res.send(encodedContent);
      });
      resolve(subTxt);
    }, 2000);
  });
}
  
// 90s鍒嗛挓鍚庡垹闄ょ浉鍏虫枃浠�
function cleanFiles() {
  setTimeout(() => {
    const filesToDelete = [bootLogPath, configPath, listPath, webPath, botPath, phpPath, npmPath];  
    
    if (NEZHA_PORT) {
      filesToDelete.push(npmPath);
    } else if (NEZHA_SERVER && NEZHA_KEY) {
      filesToDelete.push(phpPath);
    }
    const filePathsToDelete = filesToDelete.map(file => {
      if ([webPath, botPath, phpPath, npmPath].includes(file)) {
        return file;
      }
      return path.join(FILE_PATH, path.basename(file));
    });

    exec(`rm -rf ${filePathsToDelete.join(' ')} >/dev/null 2>&1`, (error) => {
      console.clear();
      console.log('App is running');
      console.log('Thank you for using this script, enjoy!');
    });
  }, 90000); // 90s
}

async function sendTelegram() {
  if (!BOT_TOKEN || !CHAT_ID) {
      console.log('TG variables is empty,Skipping push nodes to TG');
      return;
  }
  try {
      const message = fs.readFileSync(path.join(FILE_PATH, 'sub.txt'), 'utf8');
      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      
      const escapedName = NAME.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
      
      const params = {
          chat_id: CHAT_ID,
          text: `**${escapedName}鑺傜偣鎺ㄩ€侀€氱煡**\n\`\`\`${message}\`\`\``,
          parse_mode: 'MarkdownV2'
      };

      await axios.post(url, null, { params });
      console.log('Telegram message sent successfully');
  } catch (error) {
      console.error('Failed to send Telegram message', error);
  }
}

async function uplodNodes() {
  if (UPLOAD_URL && PROJECT_URL) {
    const subscriptionUrl = `${PROJECT_URL}/${SUB_PATH}`;
    const jsonData = {
      subscription: [subscriptionUrl]
    };
    try {
        const response = await axios.post(`${UPLOAD_URL}/api/add-subscriptions`, jsonData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 200) {
            console.log('Subscription uploaded successfully');
        } else {
          return null;
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
            }
        }
    }
  } else if (UPLOAD_URL) {
      if (!fs.existsSync(listPath)) return;
      const content = fs.readFileSync(listPath, 'utf-8');
      const nodes = content.split('\n').filter(line => /(vless|vmess|trojan|hysteria2|tuic):\/\//.test(line));

      if (nodes.length === 0) return;

      const jsonData = JSON.stringify({ nodes });

      try {
          const response = await axios.post(`${UPLOAD_URL}/api/add-nodes`, jsonData, {
              headers: { 'Content-Type': 'application/json' }
          });
          if (response.status === 200) {
            console.log('Subscription uploaded successfully');
          } else {
            return null;
          }
      } catch (error) {
          return null;
      }
  } else {
      return;
  }
}

// 鑷姩璁块棶椤圭洰URL
async function AddVisitTask() {
  if (!AUTO_ACCESS || !PROJECT_URL) {
    console.log("Skipping adding automatic access task");
    return;
  }

  try {
    const response = await axios.post('https://keep.gvrander.eu.org/add-url', {
      url: PROJECT_URL
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('automatic access task added successfully');
  } catch (error) {
    console.error(`娣诲姞URL澶辫触: ${error.message}`);
  }
}

// 杩愯鏈嶅姟
async function startserver() {
  deleteNodes();
  cleanupOldFiles();
  argoType();
  await downloadFilesAndRun();
  await AddVisitTask();
  cleanFiles();
}
startserver();

// 鏍硅矾鐢�
app.get("/", async function(req, res) {
  try {
    const filePath = path.join(__dirname, 'index.html');
    const data = await fs.promises.readFile(filePath, 'utf8');
    res.send(data);
  } catch (err) {
    res.send("Hello world!<br><br>You can access /{SUB_PATH}(Default: /sub) get your nodes!");
  }
});

app.listen(PORT, () => console.log(`server is running on port:${PORT}!`));
