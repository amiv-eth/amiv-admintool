import m from 'mithril';
import ItemView from '../views/itemView';
import {Button, Card, IconButton, Toolbar, ToolbarTitle } from "polythene-mithril"
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

        let displayCatchphraseDe = null;
        let displayCatchphraseEn = null;
        let displayDescriptionDe = null;
        let displayDescriptionEn = null;
        let displayPriority = null;

        if(this.data.catchphrase_de) {
            displayCatchphraseDe = m("t3", {class: "text"}, this.data.catchphrase_de);
        }

        if(this.data.catchphrase_en) {
            displayCatchphraseEn = m("t3", {class: "text"}, this.data.catchphrase_en);
        }

        if(this.data.description_de) {
            displayDescriptionDe = m("t3", {class: "text"}, this.data.description_de);
        }

        if(this.data.description_en) {
            displayDescriptionEn = m("t3", {class: "text"}, this.data.description_en);
        }

        if(this.data.priority) {
            displayPriority = m("t3", {class: "text"}, this.data.priority);
        }

        let displayDetailsButton = m(Toolbar, { compact: true, events: { onclick: () => this.details = !this.details } }, [
            m(IconButton, { icon: { svg: m.trust(icons.ArrowRight) } }),
            m(ToolbarTitle, { text: "details" }),
        ]);
        let displayParticipantsButton = m(Toolbar, { compact: true, events: { onclick: () => this.participants = !this.participants } }, [
            m(IconButton, { icon: { svg: m.trust(icons.ArrowRight) } }),
            m(ToolbarTitle, { text: "participants" }),
        ]);
        let displayWaitlistButton = m(Toolbar, { compact: true, events: { onclick: () => this.waitlist = !this.waitlist } }, [
            m(IconButton, { icon: { svg: m.trust(icons.ArrowRight) } }),
            m(ToolbarTitle, { text: "waitlist" }),
        ]);
        let displayEmailAdressesButton = m(Toolbar, { compact: true, events: { onclick: () => this.emailAdresses = !this.emailAdresses } }, [
            m(IconButton, { icon: { svg: m.trust(icons.ArrowRight) } }),
            m(ToolbarTitle, { text: "email adresses" }),
        ]);



        let displayDetails = null;
        let displayParticipants = null;
        let displayWaitlist = null;
        let displayEmailAdresses = null;

        if (this.details) {
            displayDetailsButton = m(Toolbar, { compact: true, events: { onclick: () => this.details = !this.details } }, [
                m(IconButton, { icon: { svg: m.trust(icons.ArrowDown) } }),
                m(ToolbarTitle, { text: "details" }),
            ]);
            displayDetails = m(Card, {
                content: [
                    {
                        primary: {
                            title: "Catchphrase DE",
                            subtitle: displayCatchphraseDe
                        }
                    },
                    {
                        primary: {
                            title: "Catchphrase EN",
                            subtitle: displayCatchphraseEn
                        }
                    },
                    {
                        primary: {
                            title: "Description DE",
                            subtitle: displayDescriptionDe
                        }
                    },
                    {
                        primary: {
                            title: "Description EN",
                            subtitle: displayDescriptionEn
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
            displayParticipantsButton = m(Toolbar, { compact: true, events: { onclick: () => this.participants = !this.participants } }, [
                m(IconButton, { icon: { svg: m.trust(icons.ArrowDown) } }),
                m(ToolbarTitle, { text: "participants" }),
            ]);
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
            displayWaitlistButton = m(Toolbar, { compact: true, events: { onclick: () => this.waitlist = !this.waitlist } }, [
                m(IconButton, { icon: { svg: m.trust(icons.ArrowDown) } }),
                m(ToolbarTitle, { text: "waitlist" }),
            ]);
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
            displayEmailAdressesButton = m(Toolbar, { compact: true, events: { onclick: () => this.emailAdresses = !this.emailAdresses } }, [
                m(IconButton, { icon: { svg: m.trust(icons.ArrowDown) } }),
                m(ToolbarTitle, { text: "email adresses" }),
            ]);
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

            displayDetailsButton,
            displayDetails,

            displayParticipantsButton,
            displayParticipants,

            displayWaitlistButton,
            displayWaitlist,

            displayEmailAdressesButton,
            displayEmailAdresses,

        ])
    }


}
