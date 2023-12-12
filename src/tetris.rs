use std::fmt::Display;
// use std::time::Duration;
// use std::thread::sleep;
use rand::seq::SliceRandom;
use wasm_bindgen::prelude::*;

use crate::utils::set_panic_hook;

const STARTING_SHAPE: Shape = Shape::T;


#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum Cell {
    Taken,
    Free
}

impl Display for Cell {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let c = if *self == Cell::Taken { 'X' } else { 'O' };
        write!(f, "{}", c)
    }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum Direction {
    Up, Down, Left, Right
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
struct Position {
    x: i32,
    y: i32,
}

impl Position {
    fn new(x: i32, y: i32) -> Self {
        Self { x, y }
    }
    fn shift(&self, dir: Direction, distance: u32) -> Position {
        let distance = distance as i32;
        match dir {
            Direction::Up => (self.x, self.y + distance).into(),
            Direction::Down => (self.x, self.y - distance).into(),
            Direction::Left => (self.x - distance, self.y).into(),
            Direction::Right => (self.x + distance, self.y).into(),
        }
    }
}

impl From<&(i32, i32)> for Position {
    fn from(value: &(i32, i32)) -> Self {
        Position { x: value.0, y: value.1 }
    }
}

impl From<(i32, i32)> for Position {
    fn from(value: (i32, i32)) -> Self {
        (&value).into()
    }
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum Shape {
    T, 
    Z, 
    O, 
    S, 
    I, 
    L,
}

impl Shape {
    fn gen_shape() -> Self {
        let mut rng = rand::thread_rng();
        let shapes = [Shape::T, Shape::Z, Shape::O, Shape::S, Shape::I, Shape::L];
        *shapes.choose(&mut rng).unwrap()
    }
}

fn rotate_squares(squares: &[Position], clockwise: bool) -> Vec<Position> {
    let mut squares = squares.to_vec();
    // This only works if the shape is positioned around (0,0).
    let x_shift = -squares[0].x;
    let y_shift = -squares[0].y;
    for mut position in squares.iter_mut() {
        position.x += x_shift;
        position.y += y_shift;
    }
    // rotate around (0,0)
    if clockwise {
        for mut position in squares.iter_mut() {
            let x = position.x;
            let y = position.y;
            position.x = y;
            position.y = -x;
        }
    } else {
        for mut position in squares.iter_mut() {
            let x = position.x;
            let y = position.y;
            position.x = -y;
            position.y = x;
        }
    }
    // shift back
    for mut position in squares.iter_mut() {
        position.x -= x_shift;
        position.y -= y_shift;
    }
    squares
}

impl Shape {
    fn squares_taken(&self) -> Vec<Position> {
        let coords = match self {
            Shape::T => {
                vec![(0,0), (-1,0), (0,1), (1,0)]
            },
            Shape::Z => {
                vec![(0,0), (0,1), (-1,1), (1,0)]
            },
            Shape::O => {
                vec![(0,0), (0,1), (1,0), (1,1)]
            },
            Shape::S => {
                vec![(0,0), (0,1), (1,1), (-1,0)]
            },
            Shape::I => {
                vec![(0,0), (0,-1), (0,1), (0,2)]
            },
            Shape::L => {
                vec![(0,0), (1,0), (0,1), (0,2)]
            },
        };
        coords.iter().map(Position::from).collect()
    }
}

fn get_index(x: i32, y: i32, width: u32) -> usize {
    (y * width as i32 + x) as usize
}


#[wasm_bindgen]
pub struct Tetris {
    width: u32,
    height: u32,
    grid: Vec<Cell>,
    shape: Shape,
    shape_squares: Vec<Position>,
}

impl Tetris {
    fn get_index(&self, x: u32, y: u32) -> u32 {
        self.width * y + x
    }
    // Make a new shape when either starting the game or a shape has hit the ground
    // fn gen_new_shape(&mut self) -> bool {

    // }
    fn move_shape<F>(&mut self, movement: F) -> bool 
    where
        F: Fn(&[Position]) -> Vec<Position>
    {
        // First remove cells
        for position in self.shape_squares.iter() {
            let idx = get_index(position.x, position.y, self.width);
            self.grid[idx] = Cell::Free;
        }
        // Then check if moved-to-cells are taken or out-of-bounds
        let new_positions = movement(&self.shape_squares[..]);
        let mut move_possible = true;
        for position in new_positions.iter() {
            let idx = get_index(position.x, position.y, self.width);
            if position.y < 0 || position.x < 0 ||
                position.x >= self.width as i32 ||
                self.grid[idx] == Cell::Taken
            {
                move_possible = false;
                break;
            }
        }
        // If not apply move
        if move_possible {
            self.shape_squares = new_positions;
        }
        // Place down taken cells
        for position in self.shape_squares.iter() {
            let idx = get_index(position.x, position.y, self.width);
            self.grid[idx] = Cell::Taken;
        }

        move_possible
    }
}

#[wasm_bindgen]
impl Tetris {
    pub fn new(width: u32, height: u32) -> Self {
        let shape = STARTING_SHAPE;
        let shape_squares = shape.squares_taken().iter_mut().map(|position| {
            position.shift(Direction::Up, height-4)
                    .shift(Direction::Right, width / 2)
        }).collect();

        Tetris { 
            width, 
            height, 
            grid: [Cell::Free].repeat((width * height) as usize),
            shape, 
            shape_squares: shape_squares,
        }
    }
    pub fn handle_move(&mut self, dir: Direction) -> bool {
        // Try movement
        let movement = |positions: &[Position]| {
            positions
                .iter()
                .map(|position| position.shift(dir, 1))
                .collect()
        };
        let shape_moved = self.move_shape(movement);

        // If the shape hit the bottom then we must generate a new shape
        if !shape_moved && dir == Direction::Down {
            self.shape = Shape::gen_shape();
            self.shape_squares = self.shape.squares_taken()
                .iter_mut()
                .map(|position| {
                    position.shift(Direction::Up, self.height - 4)
                    .shift(Direction::Right, self.width / 2) 
                })
                .collect();
            for position in self.shape_squares.iter() {
                let idx = get_index(position.x, position.y, self.width);
                if self.grid[idx as usize] == Cell::Taken {
                    // Game Over!
                    return false;
                }
                self.grid[idx as usize] = Cell::Taken;
            }
        }
        true
    }
    pub fn handle_rotate(&mut self, clockwise: bool) -> bool {
        let movement = |positions: &[Position]| {
            rotate_squares(positions, clockwise)
        };
        self.move_shape(movement)
    }
    pub fn grid(&self) -> *const Cell {
        self.grid.as_ptr()
    }
}

impl Display for Tetris {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        for y in (0..self.height).rev() {
            for x in 0..self.width {
                write!(f, "{}", self.grid[self.get_index(x, y) as usize])?;
            }
            write!(f, "\n")?;
        }
        Ok(())
    }
}

#[test]
fn test_tetris() {
    let mut tetris = Tetris::new(10, 20);

    while tetris.move_shape(&Direction::Down) {
        print!("\x1B[2J");
        println!("{}", &tetris);
        // sleep(Duration::from_millis(500));
    }
}