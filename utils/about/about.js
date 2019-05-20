(async () =>
{
    const html = await import("aboutHtml");
    document.body.insertAdjacentHTML("beforeend", html);
    const nameSorter = (a, b) => a.charCodeAt(0) - b.charCodeAt(0);
    const userSorter = (a, b) => nameSorter(a.name, b.name);
    const clientType = GM_info.script.name.match(/Bilibili Evolved \((.*)\)/)[1];
    new Vue({
        el: ".bilibili-evolved-about",
        data: {
            version: settings.currentVersion,
            clientType,
            branch: /Preview|Local/.test(clientType) ? "preview" : "master",
            authors: [
                {
                    name: "Grant Howard",
                    link: "https://github.com/the1812",
                },
                {
                    name: "Coulomb-G",
                    link: "https://github.com/Coulomb-G",
                },
            ],
            contributors: [
                {
                    name: "PleiadeSubaru",
                    link: "https://github.com/Etherrrr",
                },
            ].sort(userSorter),
            participants: [],
            supporters: [
                "*飞",
                "N*v",
                "*博睿",
                "*杨",
                "*泽鹏",
            ].sort(nameSorter),
        },
        mounted()
        {
            this.fetchParticipants();
        },
        methods: {
            async fetchParticipants()
            {
                const allParticipants = new Set();
                let issues = [];
                let page = 1;
                do
                {
                    issues = await Ajax.getJson(`https://api.github.com/repos/the1812/Bilibili-Evolved/issues?state=all&direction=asc&per_page=100&page=${page}`);
                    page++;
                    for (const issue of issues)
                    {
                        allParticipants.add(issue.user.login);
                    }
                }
                while (issues.length > 0);
                this.participants = [...allParticipants].map(name =>
                {
                    return {
                        name,
                        link: `https://github.com/${name}`,
                    };
                }).filter(({ link }) =>
                {
                    return !this.authors.some(it => it.link === link) &&
                        !this.contributors.some(it => it.link === link);
                }).sort(userSorter);
            },
        },
    });
})();