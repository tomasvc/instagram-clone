import firebase from 'firebase';
import { db } from './config';

export async function getSuggestions(user, followingArray, number) {

    const snapshot = await db
                .collection('users')
                .where('username', '!=', user?.displayName)
                .get()
                

                    let alreadyFollowing = []  // contains names of people the user is already following
                    let result = [] // contains query result of people the user is NOT following
                    let users = [] // contains objects of each user extracted from result
                    
                        // find all users that the current user is already following
                        snapshot.docs.forEach(item => {

                            for (let i = 0; i < followingArray.length; i++) {
                                if (followingArray.includes(item.data().username) && !alreadyFollowing.includes(item.data().username)) {
                                    alreadyFollowing?.push(item.data().username)  
                                }
                            }

                        })

                        // get query result of users that the current user is NOT following
                        result = snapshot.docs.filter(item => {
                            return !alreadyFollowing.includes(item.data().username)
                        })

                        // extract object data from result and store in users array, maximum 5 users
                        if (result.length > number) {
                            for (let i = 0; i < number; i++) {
                                users?.push(result[i].data())
                            }
                        } else {
                            result.forEach(user => {
                                users?.push(user.data())
                            })
                        }
                    
                    return users

                
                

}