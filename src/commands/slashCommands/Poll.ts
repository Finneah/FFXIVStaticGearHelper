import {EmbedBuilder} from '@discordjs/builders';
import {
    APIEmbed,
    ApplicationCommandOptionData,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    Client,
    Colors,
    CommandInteraction,
    EmbedData
} from 'discord.js';

import {errorHandler} from '../../handler/errorHandler/errorHandler';

import {Command} from '../Command';

enum TimeUnit {
    SECONDS = 'seconds',
    MINUTES = 'minutes',
    HOURS = 'hours'
}

const EMOJIS = [':one:', ':two:', ':three:'];

const OPTIONS: ApplicationCommandOptionData[] = Array.from(
    {length: EMOJIS.length},
    (_, i) => ({
        type: ApplicationCommandOptionType.String,
        name: `option${i + 1}`,
        description: `poll option ${i + 1}`,
        required: i < 1
    })
);
const getOptions = (): ApplicationCommandOptionData[] => {
    const options: ApplicationCommandOptionData[] = [
        {
            type: ApplicationCommandOptionType.Integer,
            name: 'time',
            description: 'time test',
            required: true,
            minValue: 1,
            maxValue: 60
        },
        {
            type: ApplicationCommandOptionType.String,
            name: 'time_unit',
            description: 'time unit test',
            required: true,
            choices: [
                {name: 'seconds', value: TimeUnit.SECONDS},
                {name: 'minutes', value: TimeUnit.MINUTES},
                {name: 'hours', value: TimeUnit.HOURS}
            ]
        }
    ];

    OPTIONS.forEach((opt) => {
        options.push(opt);
    });
    options.push({
        type: ApplicationCommandOptionType.String,
        name: 'title',
        description: 'test title',
        required: false
    });
    options.push({
        type: ApplicationCommandOptionType.String,
        name: 'description',
        description: 'description test',
        required: false
    });
    options.push({
        type: ApplicationCommandOptionType.Boolean,
        name: 'dm_notify',
        description: 'dm_notify test',
        required: false
    });

    return options;
};
export const Poll: Command = {
    name: 'polli',
    description: 'pollitest',
    type: ApplicationCommandType.ChatInput,
    options: getOptions(),
    run: async (client: Client, interaction: CommandInteraction) => {
        try {
            if (!interaction.inGuild()) {
                await interaction.followUp(
                    'You can only use this command inside a server'
                );
                return;
            }

            if (!interaction.channel) {
                await interaction.followUp(
                    'You can only use this command inside a channel or the client does not have the correct intents'
                );
                return;
            }

            const buildEmbed = () => {
                const embedData: EmbedData | APIEmbed = {
                    author: {
                        name: user.username,
                        icon_url: user.displayAvatarURL()
                    },
                    title: 'Poll',
                    description: 'Beschreibung',
                    color: Colors.Blue,
                    footer: {
                        text: 'In case of a draw, a random option is selected.'
                    },
                    fields: []
                };

                shownOptions.forEach(({label, value, emoji}) => {
                    embedData.fields?.push({
                        name: label,
                        value: `${emoji} - ${value}`
                    });
                });
                const embed = new EmbedBuilder(embedData);
                return embed;
            };

            const getTimeInMs = () => {
                switch (timeUnit) {
                    case TimeUnit.SECONDS:
                        return Number(time) * 1000;
                    case TimeUnit.MINUTES:
                        return Number(time) * 60 * 1000;
                    case TimeUnit.HOURS:
                        return Number(time) * 3600 * 1000;
                }
            };

            const buildComponentsCollector = () => {
                return message.createMessageComponentCollector({
                    time: timeInMs ? Number(timeInMs) : undefined
                });
            };

            const buildReactionsCollector = () => {
                const shownEmojisMap = shownOptions.reduce<
                    Record<string, boolean>
                >((map, {emoji}) => {
                    map[emoji] = true;
                    return map;
                }, {});

                return message.createReactionCollector({
                    time: timeInMs ? Number(timeInMs) : undefined,
                    filter: (reaction) => {
                        const emoji = reaction.emoji.name;

                        if (!emoji) {
                            return false;
                        }

                        return !!shownEmojisMap[emoji];
                    }
                });
            };

            const onComponentsCollect = () => {
                componentsCollector.on(
                    'collect',
                    async (componentInteraction) => {
                        if (componentInteraction.customId === 'cancel') {
                            if (componentInteraction.user.id !== user.id) {
                                await componentInteraction.fetchReply();
                                await componentInteraction.followUp({
                                    content: 'You cannot cancel this poll',
                                    ephemeral: true
                                });
                                return;
                            }

                            reactionsCollector.stop('cancel-poll');
                            return;
                        }

                        if (componentInteraction.customId === 'end-poll') {
                            if (componentInteraction.user.id !== user.id) {
                                await componentInteraction.fetchReply();
                                await componentInteraction.followUp({
                                    content: 'You cannot end this poll',
                                    ephemeral: true
                                });
                                return;
                            }

                            reactionsCollector.stop();
                            return;
                        }
                    }
                );
            };

            const addReactions = async () => {
                for (let i = 0; i < shownOptions.length; i++) {
                    if (tooFast) {
                        return;
                    }
                    await message.react(shownOptions[i].emoji);
                }
            };

            const onReactionsEnd = () => {
                reactionsCollector.on('end', async (collected, reason) => {
                    let mostFrequentEmoji = '';
                    let maxCount = 0;

                    for (const [key, value] of collected.entries()) {
                        if (value.count > maxCount) {
                            mostFrequentEmoji = key;
                            maxCount = value.count;
                        }

                        frequencies[key] = value.count;
                    }

                    tooFast =
                        shownOptions.length !== Object.keys(frequencies).length;
                    const winner = shownOptions.find(
                        ({emoji}) => emoji === mostFrequentEmoji
                    );

                    embed
                        .setColor(Colors.Green)
                        .setDescription(
                            `The poll has ended. The winner is: ${winner?.value}`
                        )
                        .setFields([]);

                    if (tooFast) {
                        embed
                            .setDescription(
                                'Oops! The poll time is too low for reactions to be added. Consider increasing it.'
                            )
                            .setColor(Colors.Red)
                            .setFooter(null);
                    } else {
                        shownOptions.forEach(({value, emoji}) => {
                            embed.addFields([
                                {
                                    name: `Votes for "${value}"`,
                                    value: frequencies[emoji].toString()
                                }
                            ]);
                        });
                    }

                    if (reason === 'cancel-poll') {
                        embed
                            .setColor(Colors.Red)
                            .setDescription('This poll was cancelled.')
                            .setFooter(null);
                    }

                    await message.reactions.removeAll();

                    await message.edit({embeds: [embed], components: []});

                    if (dmNotify && reason !== 'cancel-poll' && !tooFast) {
                        await user.send(
                            `Your poll (${message.url}) ended successfully.`
                        );
                    }
                });
            };

            const {options, user, channel} = interaction;
            const time = interaction.options.data.find(
                (option) => option.name === 'time'
            )?.value;
            const timeUnit = interaction.options.data.find(
                (option) => option.name === 'time_unit'
            )?.value;
            const shownOptions = OPTIONS.map(({name, description}, i) => ({
                emoji: EMOJIS[i],
                label: description,
                value: options.get(name)?.value
            })).filter((shownOption) => !!shownOption.value);

            const dmNotify = options.get('dm_notify') ?? true;

            const embed = buildEmbed();

            await interaction.followUp({
                content: 'Poll successfully created'
            });

            const message = await channel.send({
                embeds: [embed],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                style: 2,
                                label: `Cancel`,
                                custom_id: `cancel`,
                                disabled: false,
                                type: 2
                            },
                            {
                                style: 1,
                                label: `End poll now`,
                                custom_id: `end-poll`,
                                disabled: false,
                                type: 2
                            }
                        ]
                    }
                ]
            });

            const timeInMs = time && getTimeInMs();
            const componentsCollector = buildComponentsCollector();
            const reactionsCollector = buildReactionsCollector();

            const frequencies: Record<string, number> = {};
            let tooFast = false;

            onReactionsEnd();

            await addReactions();

            onComponentsCollect();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: Error | any) {
            errorHandler('Test', error, interaction);
        }
    }
};
