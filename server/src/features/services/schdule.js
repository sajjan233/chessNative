import { scheduleJob } from "node-schedule";
import Room from "../Room/room.js";
import User from "../user/user.js";
import Chess from "../chess/socket.js";



async function joinOrCreateRoomWithUser(socket, io) {
    try{
        console.log("run///////");
        
        let room = await Room.findOne({
            gameStatus: 'waiting',
            $expr: { $eq: [{ $size: "$users" }, 1] },
  });

        console.log(".....room..///..",room);

        if (room) {
            

            let user = await User.findOne({ role: '689ec31c710fcd3003b502c4' })
            console.log('user',user)
            if (!user) {
                console.log("user", user);

                user = await User.create({
                    name: 'boatuser',
                    username: 'boatuser',
                    email: 'boatuser@gmail.com',
                    password: 123456,
                    role: '689ec31c710fcd3003b502c4'
                });
            }

            let data = { id: user.id, roomid: room.id }
            console.log("data",data);
            
          let resp =  await Chess.chessPlayerConnect(data, socket, io)

          console.log('reafsfasfsdf',resp);
          



        }

    } catch (error) {
        return { success: false, message: 'Error creating user/room', error };
    }
}




const schedulers = (io,socket) => {



    schedulers.job = scheduleJob('*/30 * * * * *', async function () {
        await joinOrCreateRoomWithUser(socket, io)
        console.log('run.........');

    });






}


export default schedulers
