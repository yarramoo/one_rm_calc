use std::fmt::Display;
use std::time::Duration;
use std::thread::sleep;
use rand::seq::SliceRandom;

const STARTING_SHAPE: Shape = Shape::T;

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum Cell {
    Taken,
    Free
}

impl Display for Cell {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let c = if *self == Cell::Taken { 'X' } else { 'O' };
        write!(f, "{}", c)
    }
}

#[derive(PartialEq, Eq)]
enum Direction {
    Up, Down, Left, Right
}

#[derive(Debug)]
struct Position {
    x: i32,
    y: i32,
}

impl Position {
    fn new(x: i32, y: i32) -> Self {
        Self { x, y }
    }
    fn shift(&self, dir: &Direction, distance: u32) -> Position {
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

struct Rotation(u8);

impl Rotation {
    fn rotate_left(&mut self) { 
        self.0 = (self.0 + 4 - 1) % 4;
    }
    fn rotate_right(&mut self) {
        self.0 = (self.0 + 1) % 4;
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

fn rotate_squares(squares: &mut [Position]) {
    for position in squares {
        let x = position.x;
        let y = position.y;
        position.x = y;
        position.y = -x;
    }
}

impl Shape {
    fn squares_taken(&self) -> Vec<Position> {
        match self {
            Shape::T => {
                vec![(0,0), (-1,0), (0,1), (1,0)].iter().map(Position::from).collect()
            },
            Shape::Z => {
                vec![(0,0), (0,1), (-1,1), (1,0)].iter().map(Position::from).collect()
            },
            _ => todo!(),
            // Shape::O => ,
            // Shape::S => todo!(),
            // Shape::I => todo!(),
            // Shape::L => todo!(),
        }
    }
    // fn squares_taken_with_rotation(&self, rotation: Rotation) -> Vec<Position> {

    // }
}

struct Tetris {
    width: u32,
    height: u32,
    grid: Vec<Cell>,
    shape: Shape,
    shape_squares: Vec<Position>,
    settled: bool,
}

impl Tetris {
    fn new(width: u32, height: u32) -> Self {
        let shape = STARTING_SHAPE;
        let shape_squares = shape.squares_taken().iter_mut().map(|position| {
            position.shift(&Direction::Up, height-4)
                    .shift(&Direction::Right, width / 2)
        }).collect();

        Tetris { 
            width, 
            height, 
            grid: [Cell::Free].repeat((width * height) as usize),
            shape, 
            shape_squares: shape_squares,
            settled: false,
        }
    }
    fn get_index(&self, x: u32, y: u32) -> u32 {
        self.width * y + x
    }
    fn get_index_from_position(position: &Position, width: u32, height: u32) -> u32 {
        if position.x < 0 || position.x >= width as i32 ||
            position.y < 0 || position.y >= height as i32
        {
            panic!("ERROR: Tetris.get_index_from_position() -- Tried to access an out-of-bounds square");
        }
        position.y as u32 * width + position.x as u32
    }
    fn move_shape(&mut self, dir: Direction) -> bool {
        // Return true if the shape was able to move. False if not
        if dir == Direction::Up {
            panic!("Player tried to move block up??");
        }
        
        // First remove cells
        for position in self.shape_squares.iter() {
            let idx = Tetris::get_index_from_position(position, self.width, self.height);
            self.grid[idx as usize] = Cell::Free;
        }
        // Then check if moved-to-cells are taken or out-of-bounds
        let mut move_possible = true;
        for position in self.shape_squares.iter() {
            let new_position = position.shift(&dir, 1); 
            // If out-of-bounds cannot move 
            if new_position.y < 0 || new_position.x < 0 ||
                new_position.x >= self.width as i32 
            {
                move_possible = false;
                break;
            }
            let idx = Tetris::get_index_from_position(&new_position, self.width, self.height);
            // If any cell is taken cannot move
            if self.grid[idx as usize] == Cell::Taken {
                move_possible = false;
                break;
            }
        }
        // If not apply move
        if move_possible {
            for position in self.shape_squares.iter_mut() {
                *position = position.shift(&dir, 1);
            }
        }
        // Place down taken cells
        for position in self.shape_squares.iter() {
            let idx = Tetris::get_index_from_position(&position, self.width, self.height);
            self.grid[idx as usize] = Cell::Taken;
        }

        move_possible
    }
    fn grid(&self) -> *const Cell {
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

    while tetris.move_shape(Direction::Down) {
        print!("\x1B[2J");
        println!("{}", &tetris);
        sleep(Duration::from_millis(500));
    }
}