const Discord = require("discord.js");
var fs = require("fs");
const client = new Discord.Client();

var request = require("request");

const { readdirSync } = require("fs");

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const OwnerId = "290464538959282176";

const FolderName = "/app/userdatas/";

let isaskinforusername = new Set();
let cooldown = new Set();

const commandparm = "!";

var url = "http://www.roblox.com/user.aspx?username=";
const nametouserid = "http://api.roblox.com/users/get-by-username?username=";
const useridtoname = "http://api.roblox.com/users/";

require("dotenv").config(); // dotenv 실

process.on("uncaughtException", function(exception) {
  console.log(exception, " : ERROR");
});

client.on("ready", () => {
  console.log("BOT INITALIZED");
});

var Things = [
  "oof",
  "lol",
  "city",
  "moon",
  "you",
  "hello",
  "hi",
  "big",
  "roblox",
  "fun",
  "cat",
  "cow",
  "dog",
  "awesome",
  "beautiful",
  "play",
  "run",
  "win",
  "good",
  "like",
  "generous",
  "genius",
  "calm",
  "divine",
  "happy"
];

function IfMessageSentByOwner(msg) {
  if (msg.author.id == OwnerId) {
    return true;
  } else {
    return false;
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function CheckCommand(msg, command) {
  var Length = command.length + commandparm.length;

  if (msg.content.substr(0, Length) == commandparm + command) {
    cooldown.add(msg.author.id);

    setTimeout(function() {
      cooldown.delete(msg.author.id);
    }, 3000);
    return true;
  } else {
    return false;
  }
}

function SaveUserdata(UserId, Data) {
  try {
    fs.writeFileSync(FolderName + UserId + ".json", JSON.stringify(Data));
  } catch {
    console.log("Error!!");
  }
}

function GetUserdata(UserId) {
  try {
    if (fs.existsSync(FolderName + UserId + ".json")) {
      return JSON.parse(fs.readFileSync(FolderName + UserId + ".json"));
    } else {
      return "";
    }
  } catch {
    //console.log("Error!!")
  }
}

function RemoveUserData(UserId)
{
  try {
    fs.unlinkSync(FolderName + UserId + ".json")
  }catch {

  }
}

function get(source) {
  var rest = source.split(
    '<span class="profile-about-content-text linkify" ng-non-bindable>'
  )[1];
  rest = rest.split("</span>")[0];

  return rest;
}

function HttpGet(geturl) {
  var Return = "";

  request(
    {
      uri: geturl
    },
    function(error, response, body) {
      Return = body;
    }
  );

  return Return;
}

function ProcessVerification(robloxname,author,channel)
{
  var Result = "";

  for (var i = 0; i < 8; i++) {
    var Random = getRandomInt(0, Things.length);

    Result = Result + Things[Random] + " ";
  }

  Result = Result.substr(0, Result.length - 1);

  SaveUserdata(author, { robloxname: robloxname, code: Result });

  setTimeout(function() {
    if (!GetUserdata(msg.author.id).IsVerified) {
      RemoveUserData(author)

      const FailedEmbed = new Discord.MessageEmbed()
        .setTitle("인증 실패")
        .setDescription("제한 시간 5분을 초과하여 인증이 자동으로 취소되었어요!")
        .setFooter(robloxname)
      
      channel.send(FailedEmbed)

    }
  },500000)

  const verifyembed = new Discord.MessageEmbed()
    .setTitle(`안녕하세요, ${robloxname}님!`)
    //.attachFiles(['../assets/discordjs.png'])
    .setImage('https://cdn.discordapp.com/attachments/697789043567493140/713770169339740210/verify.png')
    .setDescription("아래 보이는 사진에 있는 칸에 해당 메시지를 보내주세요! 한번 인증을 하면 인증된 계정은 바꿀수 없으니 신중하게 인증하세요!\n\n ```" + Result + "```\n https://www.roblox.com/my/account#!/info \n 다 되었을시, 채팅에 !done 이라고 치세요!")
    .setFooter("제한시간 5분")
    
  channel.send(verifyembed)
}

client.on("message", msg => {
  if (msg.channel.type == "dm") return;
  if (msg.author.bot) return;

  async function DOASYNC() {
    var args = msg.content.split(" ");

    if (CheckCommand(msg, "ping")) {
      msg.reply("pong");
    }

    if (isaskinforusername.has(msg.author.id))
    {
      isaskinforusername.delete(msg.author.id)
      ProcessVerification(msg.content,msg.author,msg.channel)
      return;
    }

    if (cooldown.has(msg.author.id)) {
      msg.reply("현재 쿨타임이 걸리신 상태입니다. 몇초후 다시 시도해주세요.");
      return;
    }

    if (msg.content.includes("discord.gg")) {
      if (IfMessageSentByOwner(msg)) {
      } else {
        msg.delete();

        msg.reply("초대 링크를 첨부할수 없습니다!");
      }
    }

    if (CheckCommand(msg, "verify")) {
      var robloxname = args[1];

      if (GetUserdata(msg.author.id).IsVerified) {
        var role = msg.guild.roles.cache.find(role => role.name === "인증됨");
        msg.member.roles.add(role);
        msg.reply("이미 인증을 하신 상태네요!");
      } else {
        if (!robloxname || !robloxname.trim()) {
            //"로블록스 이름을 입력하지 않으셨어요! (!verify <로블록스 이름>)"
            const verifyembed = new Discord.MessageEmbed()
              .setTitle(`인증`)
              //.attachFiles(['../assets/discordjs.png'])b
              .setDescription("당신의 로블록스 이름은 무엇인가요?")
              
            msg.channel.send(verifyembed)
            isaskinforusername.add(msg.author.id)
        } else {
          ProcessVerification(robloxname,msg.author,msg.channel)
        }
      }

      return;
    }

    if (CheckCommand(msg, "done")) {
      var data = GetUserdata(msg.author.id);

      if (data || data.robloxname || data.code) {
        var username = data.robloxname;
        var code = data.code;

        var urlforuser = url + username;

        request(
          {
            uri: urlforuser
          },
          function(error, response, body) {
            var result = get(body);

            if (result == code) {
              request(
                {
                  uri: nametouserid + username
                },
                function(er1, res2, got) {
                  SaveUserdata(msg.author.id, {
                    IsVerified: true,
                    userid: JSON.parse(got).Id
                  });
                  
                  var role = msg.guild.roles.cache.find(role => role.name === "인증됨");
                  msg.member.roles.add(role);
                  

                  msg.member.setNickname("{" + username + "}")

                  msg.reply("인증에 성공했어요!");
                }
              );
            } else {
              msg.reply("인증에 실패하였어요! 프로필에 해당 코드를 넣었는지 다시 한번 확인해봐요!");
            }
          }
        );
      } else {
        msg.reply("알수 없는 에러가 발생하였어요!");
      }

      return;
    }

    if (CheckCommand(msg,"cancel")) {
      if (GetUserdata(msg.author.id)["code"])
      {
        SaveUserdata(msg.author.id,{})
        msg.reply("정보를 초기화 했어요!")
      }
    }

    if (CheckCommand(msg,"forceverify"))
    {
      if (IfMessageSentByOwner(msg)) {
        var TargetUser = msg.guild.members.cache.get(args[1].split("<@!")[1].split(">")[0]);
        if (args[1] && args[2])
        {
        request({uri: nametouserid + args[2]},function(_,_,result) {
          var UserId = JSON.parse(result).Id

          SaveUserdata(TargetUser.id, {
            IsVerified: true,
            userid: UserId
          });

          var role = msg.guild.roles.cache.find(role => role.name === "인증됨");
          msg.member.roles.add(role);
                  

          msg.member.setNickname("{" + username + "}")

          msg.reply("성공!")
        })
      }
      }
    }

    if (CheckCommand(msg, "robloxinfo")) {
        try
        {
            var TargetUser = msg.guild.members.cache.get(args[1].split("<@!")[1].split(">")[0]);

            if (TargetUser && TargetUser.id) {
            var userinfo = GetUserdata(TargetUser.id);
        
            if (userinfo && userinfo.userid) {
                var UserId = userinfo.userid;
        
                request({ uri: useridtoname + UserId }, function(tr1, tr2, got) {
                var ProfileLink = "https://web.roblox.com/users/" + UserId + "/profile";
                
                request({uri: "https://users.roblox.com/v1/users/" + UserId},function(tr3,tr4,robloxuserinfogot) {
                    var RobloxUserInfo = JSON.parse(robloxuserinfogot);
                    var username = RobloxUserInfo.name;
            
                    const infoembed = new Discord.MessageEmbed()
                        .setColor("#0099ff")
                        .setTitle("프로필 링크")
                        .setURL(ProfileLink)
                        .setAuthor("유저 정보")
                        .setDescription("이름 : " + username + "\n유저 ID : " + UserId + "\n계정 생성일 : " + RobloxUserInfo.created + "\n자기소개 메시지 : " + RobloxUserInfo.description
                        )
                    
                    msg.channel.send(infoembed)
                })
                });
            } else {
                msg.reply("해당 유저는 인증되지 않은 유저에요!");
            }
            } else {
            msg.reply("입력하신 유저를 찾을수 없어요!");
            }
        }
        catch
        {
            msg.reply("알수 없는 에러가 발생했어요!")
        }
        return;
      }

      if (CheckCommand(msg,"hban"))
      {
        if (IfMessageSentByOwner(msg))
        {
          if (args[1].includes("<@!"))
          {
            var TargetUser = msg.guild.members.cache.get(args[1].split("<@!")[1].split(">")[0])
            var UserData = GetUserdata(TargetUser.id)

            if (UserData.IsVerified)
            {
              var TargetUserid = UserData.userid

              request({uri: "https://yuha529.000webhostapp.com/YuraBanDataBase/api/?secure=" + process.env.DATABASEAPIKEY +"&Key=" + TargetUserid + "/"},function(_,_,response) {
                if (response == "OK")
                {
                  TargetUser.ban({ days: 0, reason: args[2]})
                  msg.reply("성공적으로 데이터 베이스 + 디스코드 에서 벤했습니다!")
                  
                  if (msg.guild.channels.cache.get("713728603745157121"))
                  {
                    var msgchhannel = msg.guild.channels.cache.get("713728603745157121")
                    var Reason = args[2]

                    Reason = Reason || "이유가 입력되지 않음"

                    const banembed = new Discord.MessageEmbed()
                        .setColor("#0099ff")
                        .setTitle(TargetUser.user.tag + " - " + TargetUser.id)
                        .setDescription("디스코드 영구벤\n인게임 영구벤")
                        .setFooter("사유 : " + Reason)
                    
                    msgchhannel.send(banembed)
                  }
                }
                else
                {
                  msg.reply("데이터 베이스 등록중 알수 없는 에러가 발생하였습니다!")
                }
              })
            }
            else
            {
              msg.reply("해당 유저를 인증 시스템 데이터 베이스에서 찾을수 없습니다! 디스코드 벤만 진행합니다.")
              TargetUser.ban({ days: 0, reason: args[2]})
            }
          }
          else
          {
            msg.reply("플레이어를 지정해주세요!")
          }
        }
      }

      if (CheckCommand(msg,"update"))
      {
        var info = GetUserdata(msg.author.id)

        if (info.IsVerified)
        {
          request({uri: useridtoname + info.userid},function(_,_,usernamejson)
          {
            var RobloxUserData = JSON.parse(usernamejson)

            var username = RobloxUserData.Username

            request(
              {
                uri: nametouserid + username
              },
              function(er1, res2, got) {
                var role = msg.guild.roles.cache.find(role => role.name === "인증됨");
                msg.member.roles.add(role);
  
                msg.member.setNickname("{" + username + "}")
  
                msg.reply(`성공적으로 닉네임을 ${username}으로 업데이트 했어요!`);
              }
            );
          })
        }
        else
        {
          msg.reply("인증된 상태가 아니에요! !verify를 입력해 인증해주세요!")
        }
      }
  }

  DOASYNC();
});

client.login(process.env.SECRET);
