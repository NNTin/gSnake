use crossterm::event::{self, Event, KeyCode, KeyEvent};
use std::time::Duration;

/// Represents a user action from keyboard input
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Action {
    MoveNorth,
    MoveSouth,
    MoveEast,
    MoveWest,
    Reset,
    Quit,
    Continue, // For continuing after level complete
}

/// Input handler for keyboard events
pub struct InputHandler;

impl InputHandler {
    /// Polls for keyboard input with a timeout
    /// Returns Some(Action) if a key was pressed, None if timeout elapsed
    pub fn poll_action(timeout: Duration) -> anyhow::Result<Option<Action>> {
        if event::poll(timeout)? {
            if let Event::Key(key_event) = event::read()? {
                return Ok(Self::key_to_action(key_event));
            }
        }
        Ok(None)
    }

    /// Converts a key event to an action
    fn key_to_action(key_event: KeyEvent) -> Option<Action> {
        match key_event.code {
            // WASD controls
            KeyCode::Char('w' | 'W') | KeyCode::Up => Some(Action::MoveNorth),
            KeyCode::Char('s' | 'S') | KeyCode::Down => Some(Action::MoveSouth),
            KeyCode::Char('a' | 'A') | KeyCode::Left => Some(Action::MoveWest),
            KeyCode::Char('d' | 'D') | KeyCode::Right => Some(Action::MoveEast),

            // Reset and quit
            KeyCode::Char('r' | 'R') => Some(Action::Reset),
            KeyCode::Char('q' | 'Q') | KeyCode::Esc => Some(Action::Quit),

            // Continue (for level complete screens)
            KeyCode::Enter | KeyCode::Char(' ') => Some(Action::Continue),

            _ => None,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_key_mappings() {
        // Test movement keys
        let north = KeyEvent::from(KeyCode::Char('w'));
        assert_eq!(InputHandler::key_to_action(north), Some(Action::MoveNorth));

        let south = KeyEvent::from(KeyCode::Char('s'));
        assert_eq!(InputHandler::key_to_action(south), Some(Action::MoveSouth));

        let west = KeyEvent::from(KeyCode::Char('a'));
        assert_eq!(InputHandler::key_to_action(west), Some(Action::MoveWest));

        let east = KeyEvent::from(KeyCode::Char('d'));
        assert_eq!(InputHandler::key_to_action(east), Some(Action::MoveEast));

        // Test control keys
        let reset = KeyEvent::from(KeyCode::Char('r'));
        assert_eq!(InputHandler::key_to_action(reset), Some(Action::Reset));

        let quit = KeyEvent::from(KeyCode::Char('q'));
        assert_eq!(InputHandler::key_to_action(quit), Some(Action::Quit));
    }
}
