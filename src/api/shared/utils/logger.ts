import { format, createLogger, transports } from 'winston';

// NOTE(wasit): For more info refer https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/

const { combine, prettyPrint, align, timestamp, colorize, printf } = format;

const consoleLogFormat = combine(
	printf((info) => {
		return `[${info.timestamp}] ${info.level}: ${info.message}`;
	})
);

export const logger = createLogger({
	level: 'info',
	format: combine(colorize({ all: true }), prettyPrint(), align(), timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SSS A' }), consoleLogFormat),
	transports: [new transports.Console()],
	defaultMeta: { service: 'DTS' },
});
