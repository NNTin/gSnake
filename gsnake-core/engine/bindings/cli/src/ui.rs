#![allow(dead_code)] // UI functions are used in examples and will be used in T5

use gsnake_core::{CellType, Frame, GameStatus};
use ratatui::{
    layout::{Alignment, Constraint, Direction, Layout, Rect},
    style::{Color, Modifier, Style},
    text::{Line, Span},
    widgets::{Block, Borders, Paragraph},
    Frame as RatatuiFrame,
};

/// Colors for different cell types
const COLOR_EMPTY: Color = Color::Black;
const COLOR_SNAKE_HEAD: Color = Color::Green;
const COLOR_SNAKE_BODY: Color = Color::LightGreen;
const COLOR_FOOD: Color = Color::Red;
const COLOR_FLOATING_FOOD: Color = Color::Rgb(255, 152, 0); // Orange
const COLOR_FALLING_FOOD: Color = Color::Yellow;
const COLOR_STONE: Color = Color::Rgb(121, 85, 72); // Brown
const COLOR_SPIKE: Color = Color::LightRed;
const COLOR_OBSTACLE: Color = Color::Gray;
const COLOR_EXIT: Color = Color::Cyan;

/// Characters for different cell types
const CHAR_EMPTY: &str = "  ";
const CHAR_SNAKE_HEAD: &str = "●●";
const CHAR_SNAKE_BODY: &str = "██";
const CHAR_FOOD: &str = "◆◆";
const CHAR_FLOATING_FOOD: &str = "◇◇";
const CHAR_FALLING_FOOD: &str = "◈◈";
const CHAR_STONE: &str = "■■";
const CHAR_SPIKE: &str = "▲▲";
const CHAR_OBSTACLE: &str = "▓▓";
const CHAR_EXIT: &str = "⚑⚑";

/// Main UI renderer for the gSnake CLI
pub struct UI;

impl UI {
    /// Renders the complete game UI
    pub fn render(f: &mut RatatuiFrame, frame: &Frame) {
        let chunks = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Length(3),           // Status bar
                Constraint::Min(0),               // Game grid
                Constraint::Length(1),            // Footer/help
            ])
            .split(f.area());

        // Render status bar
        Self::render_status_bar(f, chunks[0], frame);

        // Render game grid
        Self::render_grid(f, chunks[1], frame);

        // Render footer
        Self::render_footer(f, chunks[2]);

        // Render overlays if needed
        match frame.state.status {
            GameStatus::GameOver => Self::render_game_over_overlay(f, f.area()),
            GameStatus::LevelComplete | GameStatus::AllComplete => {
                Self::render_level_complete_overlay(f, f.area(), frame.state.status);
            }
            GameStatus::Playing => {}
        }
    }

    /// Renders the status bar showing level, moves, and food collected
    fn render_status_bar(f: &mut RatatuiFrame, area: Rect, frame: &Frame) {
        let status_text = format!(
            " Level: {} | Moves: {} | Food: {}/{} ",
            frame.state.current_level, frame.state.moves, frame.state.food_collected, frame.state.total_food
        );

        let status = Paragraph::new(status_text)
            .style(
                Style::default()
                    .fg(Color::White)
                    .bg(Color::DarkGray)
                    .add_modifier(Modifier::BOLD),
            )
            .alignment(Alignment::Center)
            .block(Block::default().borders(Borders::ALL).title(" gSnake "));

        f.render_widget(status, area);
    }

    /// Renders the game grid
    fn render_grid(f: &mut RatatuiFrame, area: Rect, frame: &Frame) {
        let grid_height = frame.grid.len();
        let grid_width = if grid_height > 0 {
            frame.grid[0].len()
        } else {
            0
        };

        // Create lines for the grid
        let mut lines = Vec::new();

        for row in &frame.grid {
            let mut spans = Vec::new();
            for cell in row {
                let (ch, color) = Self::cell_to_char_color(*cell);
                spans.push(Span::styled(ch, Style::default().fg(color)));
            }
            lines.push(Line::from(spans));
        }

        let block = Block::default()
            .borders(Borders::ALL)
            .title(format!(" Grid: {grid_width}x{grid_height} "));

        let paragraph = Paragraph::new(lines)
            .block(block)
            .alignment(Alignment::Center);

        f.render_widget(paragraph, area);
    }

    /// Renders the footer with help text
    fn render_footer(f: &mut RatatuiFrame, area: Rect) {
        let help_text = " WASD: Move | R: Reset | Q: Quit ";
        let footer = Paragraph::new(help_text)
            .style(Style::default().fg(Color::DarkGray))
            .alignment(Alignment::Center);

        f.render_widget(footer, area);
    }

    /// Renders game over overlay
    fn render_game_over_overlay(f: &mut RatatuiFrame, area: Rect) {
        let overlay_area = Self::centered_rect(50, 30, area);

        let lines = vec![
            Line::from(vec![Span::styled(
                "═══════════════════════════",
                Style::default().fg(Color::Red).add_modifier(Modifier::BOLD),
            )]),
            Line::from(""),
            Line::from(vec![Span::styled(
                "        GAME OVER",
                Style::default()
                    .fg(Color::Red)
                    .add_modifier(Modifier::BOLD),
            )]),
            Line::from(""),
            Line::from(vec![Span::styled(
                "    Press R to Restart",
                Style::default().fg(Color::White),
            )]),
            Line::from(vec![Span::styled(
                "    Press Q to Quit",
                Style::default().fg(Color::White),
            )]),
            Line::from(""),
            Line::from(vec![Span::styled(
                "═══════════════════════════",
                Style::default().fg(Color::Red).add_modifier(Modifier::BOLD),
            )]),
        ];

        let block = Block::default()
            .borders(Borders::ALL)
            .style(Style::default().bg(Color::Black).fg(Color::Red));

        let paragraph = Paragraph::new(lines)
            .block(block)
            .alignment(Alignment::Center);

        // Clear the background
        f.render_widget(ratatui::widgets::Clear, overlay_area);
        f.render_widget(paragraph, overlay_area);
    }

    /// Renders level complete overlay
    fn render_level_complete_overlay(
        f: &mut RatatuiFrame,
        area: Rect,
        status: GameStatus,
    ) {
        let overlay_area = Self::centered_rect(50, 30, area);

        let (title, color) = match status {
            GameStatus::AllComplete => ("ALL LEVELS COMPLETE!", Color::Magenta),
            _ => ("LEVEL COMPLETE!", Color::Green),
        };

        let lines = vec![
            Line::from(vec![Span::styled(
                "═══════════════════════════",
                Style::default().fg(color).add_modifier(Modifier::BOLD),
            )]),
            Line::from(""),
            Line::from(vec![Span::styled(
                format!("      {title}"),
                Style::default().fg(color).add_modifier(Modifier::BOLD),
            )]),
            Line::from(""),
            Line::from(vec![Span::styled(
                if status == GameStatus::AllComplete {
                    "    Congratulations!"
                } else {
                    "  Press any key to continue"
                },
                Style::default().fg(Color::White),
            )]),
            Line::from(""),
            Line::from(vec![Span::styled(
                "═══════════════════════════",
                Style::default().fg(color).add_modifier(Modifier::BOLD),
            )]),
        ];

        let block = Block::default()
            .borders(Borders::ALL)
            .style(Style::default().bg(Color::Black).fg(color));

        let paragraph = Paragraph::new(lines)
            .block(block)
            .alignment(Alignment::Center);

        // Clear the background
        f.render_widget(ratatui::widgets::Clear, overlay_area);
        f.render_widget(paragraph, overlay_area);
    }

    /// Renders "Terminal too small" warning
    pub fn render_terminal_too_small(f: &mut RatatuiFrame, required_width: u16, required_height: u16) {
        let area = f.area();

        let lines = vec![
            Line::from(""),
            Line::from(vec![Span::styled(
                "Terminal Too Small",
                Style::default()
                    .fg(Color::Red)
                    .add_modifier(Modifier::BOLD),
            )]),
            Line::from(""),
            Line::from(vec![Span::styled(
                format!("Required: {required_width}x{required_height} cells"),
                Style::default().fg(Color::White),
            )]),
            Line::from(vec![Span::styled(
                format!("Current: {}x{} cells", area.width, area.height),
                Style::default().fg(Color::Yellow),
            )]),
            Line::from(""),
            Line::from(vec![Span::styled(
                "Please resize your terminal",
                Style::default().fg(Color::White),
            )]),
            Line::from(""),
            Line::from(vec![Span::styled(
                "Press Q to quit",
                Style::default().fg(Color::DarkGray),
            )]),
        ];

        let paragraph = Paragraph::new(lines)
            .block(
                Block::default()
                    .borders(Borders::ALL)
                    .title(" Warning ")
                    .style(Style::default().fg(Color::Red)),
            )
            .alignment(Alignment::Center);

        let centered_area = Self::centered_rect(60, 40, area);
        f.render_widget(paragraph, centered_area);
    }

    /// Converts a `CellType` to a character and color
    fn cell_to_char_color(cell: CellType) -> (&'static str, Color) {
        match cell {
            CellType::Empty => (CHAR_EMPTY, COLOR_EMPTY),
            CellType::SnakeHead => (CHAR_SNAKE_HEAD, COLOR_SNAKE_HEAD),
            CellType::SnakeBody => (CHAR_SNAKE_BODY, COLOR_SNAKE_BODY),
            CellType::Food => (CHAR_FOOD, COLOR_FOOD),
            CellType::FloatingFood => (CHAR_FLOATING_FOOD, COLOR_FLOATING_FOOD),
            CellType::FallingFood => (CHAR_FALLING_FOOD, COLOR_FALLING_FOOD),
            CellType::Stone => (CHAR_STONE, COLOR_STONE),
            CellType::Spike => (CHAR_SPIKE, COLOR_SPIKE),
            CellType::Obstacle => (CHAR_OBSTACLE, COLOR_OBSTACLE),
            CellType::Exit => (CHAR_EXIT, COLOR_EXIT),
        }
    }

    /// Creates a centered rectangle
    fn centered_rect(percent_x: u16, percent_y: u16, r: Rect) -> Rect {
        let popup_layout = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Percentage((100 - percent_y) / 2),
                Constraint::Percentage(percent_y),
                Constraint::Percentage((100 - percent_y) / 2),
            ])
            .split(r);

        Layout::default()
            .direction(Direction::Horizontal)
            .constraints([
                Constraint::Percentage((100 - percent_x) / 2),
                Constraint::Percentage(percent_x),
                Constraint::Percentage((100 - percent_x) / 2),
            ])
            .split(popup_layout[1])[1]
    }
}

/// Validates if the terminal is large enough for the game
pub fn validate_terminal_size(terminal_width: u16, terminal_height: u16, grid_width: usize, grid_height: usize) -> Result<(), String> {
    // Each cell takes 2 characters width
    let required_width = (grid_width as u16 * 2) + 4; // +4 for borders
    let required_height = grid_height as u16 + 6; // +6 for status bar, borders, footer

    if terminal_width < required_width || terminal_height < required_height {
        Err(format!(
            "Terminal too small. Required: {required_width}x{required_height}, Current: {terminal_width}x{terminal_height}"
        ))
    } else {
        Ok(())
    }
}
