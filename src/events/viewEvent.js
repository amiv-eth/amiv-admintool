import m from 'mithril';
import ItemView from '../views/itemView';
//import { Button } from "polythene-mithril"
import {Button, Card, IconButton, Toolbar, ToolbarTitle } from "polythene-mithril"
//import { addLayoutStyles } from "polythene-css"
import { icons } from '../views/elements';

export default class viewEvent extends ItemView {
    constructor() {
        super('events');
        this.details = false;
        this.participants = false;
        this.waitlist = false;
        this.emailAdresses = false;
    }

    view() {
        if (!this.data) return '';
        console.log(Object.keys(this));
        console.log(this['data']);

        let displayCatchphrase = null;
        let displayDescription = null;
        let displayPriority = null;

        if(this.data.catchphrase_de) {
            displayCatchphrase = m("t3", {class: "text"}, this.data.catchphrase_de);
        }

        if(this.data.description_de) {
            displayDescription = m("t3", {class: "text"}, this.data.description_de);
        }

        if(this.data.priority) {
            displayPriority = m("t3", {class: "text"}, this.data.priority);
        }

        let displayDetailsButton = m(Toolbar, { compact: true, events: { onclick: () => this.details = !this.details } }, [
            m(IconButton, { icon: { svg: m.trust(icons.ArrowRight) } }),
            m(ToolbarTitle, { text: "Title" }),
        ]);
        let displayParticipantsButton = null;
        let displayWaitlistButton = null;
        let displayEmailAdressesButton = null;



        let displayDetails = null;
        let displayParticipants = null;
        let displayWaitlist = null;
        let displayEmailAdresses = null;

        if (this.details) {
            displayDetails = m(Card, {
                content: [
                    {
                        primary: {
                            title: "Catchphrase",
                            subtitle: displayCatchphrase
                        }
                    },
                    {
                        primary: {
                            title: "Description",
                            subtitle: displayDescription
                        }
                    },
                    {
                        primary: {
                            title: "Priority",
                            subtitle: displayPriority
                        }
                    },
                    {
                        actions: {
                            content: [
                                m(Button, {
                                    label: "Action 1"
                                }),
                                m(Button, {
                                    label: "Action 2"
                                })
                            ]
                        }
                    },
                    {
                        text: {
                            content: "More text"
                        }
                    }
                ]

            })
        }

        if (this.participants) {
            displayParticipants = m(Card, {
                content: [
                    {
                        primary: {
                            title: "Primary title",
                            subtitle: "Subtitle"
                        }
                    },
                    {
                        actions: {
                            content: [
                                m(Button, {
                                    label: "Action 1"
                                }),
                                m(Button, {
                                    label: "Action 2"
                                })
                            ]
                        }
                    },
                    {
                        text: {
                            content: "More text"
                        }
                    }
                ]

            })
        }

        if (this.waitlist) {
            displayWaitlist = m(Card, {
                content: [
                    {
                        primary: {
                            title: "Primary title",
                            subtitle: "Subtitle"
                        }
                    },
                    {
                        actions: {
                            content: [
                                m(Button, {
                                    label: "Action 1"
                                }),
                                m(Button, {
                                    label: "Action 2"
                                })
                            ]
                        }
                    },
                    {
                        text: {
                            content: "More text"
                        }
                    }
                ]

            })
        }

        if (this.emailAdresses) {
            displayEmailAdresses = m(Card, {
                content: [
                    {
                        primary: {
                            title: "Primary title",
                            subtitle: "Subtitle"
                        }
                    },
                    {
                        actions: {
                            content: [
                                m(Button, {
                                    label: "Action 1"
                                }),
                                m(Button, {
                                    label: "Action 2"
                                })
                            ]
                        }
                    },
                    {
                        text: {
                            content: "More text"
                        }
                    }
                ]

            })
        }


        return m("div", {
            style: { height: '100%', 'overflow-y': 'scroll'}
            },[
            m("h1", {class: "title"}, this.data.title_de),
            m(Button, {element: 'div', label: "Update Event"}),
            m('br'),
            m(Button, {
                element: 'div',
                label: "Details",
                events: {
                    onclick: () => this.details = !this.details
                }
            }),

            displayDetails,

            displayDetailsButton,

            m('br'),
            m(Button, {
                element: 'div',
                label: "Participants",
                events: {
                    onclick: () => this.participants = !this.participants
                }
            }),

            displayParticipants,

            m('br'),
            m(Button, {
                element: 'div',
                label: "Waitlist",
                events: {
                    onclick: () => this.waitlist = !this.waitlist
                }
            }),

            displayWaitlist,

            m('br'),
            m(Button, {
                element: 'div',
                label: "Email Adresses",
                events: {
                    onclick: () => this.emailAdresses = !this.emailAdresses
                }
            }),

            displayEmailAdresses,

        ])
    }


}
