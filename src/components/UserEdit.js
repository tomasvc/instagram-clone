import React from 'react';
import {Avatar} from "@material-ui/core";
import './UserEdit.css';

export default function UserEdit({ user }) {
    return (
        <div className="userEdit">
            <div className="userEdit__wrapper">
                <div className="userEdit__left">
                    <ul className="left__nav">
                        <li className="left__navItem navItem__selected">Edit Profile</li>
                        <li className="left__navItem">Change Password</li>
                        <li className="left__navItem">Apps and Websites</li>
                        <li className="left__navItem">Email and SMS</li>
                        <li className="left__navItem">Push Notifications</li>
                        <li className="left__navItem">Manage Contacts</li>
                        <li className="left__navItem">Privacy and Security</li>
                        <li className="left__navItem">Login Activity</li>
                        <li className="left__navItem">Emails from Instagram</li>
                        <li className="left__navItem">Switch to Professional Account</li>
                    </ul>
                </div>
                <div className="userEdit__right">
                    <div className="right__top">
                        <div><Avatar></Avatar></div>
                        <div>
                            <p className="right__username">{user?.displayName}</p>
                            <p className="right__changeProfileBtn">Change Profile Photo</p>
                        </div>
                    </div>
                    <form className="userEdit__form">
                        <div className="form__item form__name">
                            <aside className="item__aside">
                                <label for="name">Name</label>
                            </aside>
                            <div className="item__input">
                                <input id="name" className="item__inputField" placeholder="Name" />
                                <p className="item__note">Help people discover your account by using the name you're known by: either your full name, nickname, or business name.</p>
                            </div>
                        </div>
                        <div className="form__item form__username">
                            <aside className="item__aside">
                                <label for="username">Username</label>
                            </aside>
                            <div className="item__input">
                                <input id="username" className="item__inputField" placeholder="Username" value={user?.displayName} />
                            </div>
                        </div>
                        <div className="form__item form__website">
                            <aside className="item__aside">
                                <label for="website">Website</label>
                            </aside>
                            <div className="item__input">
                                <input id="website" className="item__inputField"  placeholder="Website" />
                            </div>
                        </div>
                        <div className="form__item form__bio">
                            <aside className="item__aside">
                                <label for="bio">Bio</label>
                            </aside>
                            <div className="item__input">
                                <input id="bio" className="item__inputField" />
                            </div>
                        </div>
                        <div className="form__item form__submit">
                            <aside className="item__aside"></aside>
                            <div className="item__input">
                                <button className="form__submitBtn" type="submit">Submit</button>
                            </div>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    )
}
