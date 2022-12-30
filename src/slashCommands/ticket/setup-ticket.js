const { Client, CommandInteraction, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, AttachmentBuilder, ApplicationCommandOptionType, ChannelType } = require('discord.js');

module.exports = {
    name: 'setup-ticket',
    description: "Setup a ticket in your server",
    clientPermissions: ["Administrator"],
    options: [
        {
            name: "channel",
            description: "provide channel to setup ticket",
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: "category",
            description: "provide category where created ticket will be displayed",
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        // this will get channel & category from options
        const data = interaction.options.getChannel("channel");
        const data2 = interaction.options.getChannel("category")

        // this will fetch channel & category from the guild
        const channel = interaction.guild.channels.cache.get(`${data.id}`);
        const category = interaction.guild.channels.cache.get(`${data2.id}`)

        // check if the provided channel is visible to bot
        if (!channel.viewable) {
            return interaction.reply({
                content: "The provided channel is not visible to me",
                ephemeral: true
            })
        }

        // check if the provided category is actually a category
        if (category.type !== ChannelType.GuildCategory) {
            return interaction.reply({
                content: "The category you provided is invalid",
                ephemeral: true
            })
        }

        // check if the provided category is visible to bot
        if (!category.viewable) {
            return interaction.reply({
                content: "The provided category is not visible to me",
                ephemeral: true
            })
        }

        if (!category.permissionsFor(client.user.id).has("ManageChannels")) {
            return interaction.reply({
                content: "The bot is missing manage-channels permissions to create ticket channel",
                ephemeral: true
            })
        }

        // if you want it in embed format just use below one
        // const embed = new EmbedBuilder()
        //     .setImage("attachment://ticket.png")
        //     .setColor("#2f3136")

        // this will create buttons 
        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`ticket-setup-${interaction.guild.id}-${category.id}`)
                    .setLabel('Create Ticket')
                    .setStyle(ButtonStyle.Danger),
            );

        // this will fetch image from assets folder made by flamequard
        const attachments = new AttachmentBuilder()
            .setFile("assets/ticket.png")

        // this will send confirm reply
        await interaction.reply({
            content: `The ticket has been setup to ${channel} successfully.`,
            ephemeral: true
        })

        // this will send the ticket setup to the provided channel
        channel.send({
            // embeds: [embed],
            components: [button],
            files: [attachments]
        })
    }
}

/**
 * ======================================================
 * Developed by FlameQuard | https://flamequard.tech
 * ======================================================
 * Mention FlameQuard when you use this codes
 * ======================================================
 * Give an awesome start to this repositories
 * ======================================================
 */