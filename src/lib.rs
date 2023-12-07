mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn say_hi(name: &str) -> String {
    format!("Hi, {name}!")
}

#[wasm_bindgen]
pub fn find_onerm(reps: usize, weight: f32) -> Option<f32> {
    let percent_of_onerm = 100. / strength_required_for_100_onerm(reps)?;
    Some(weight * percent_of_onerm)
}

fn strength_required_for_100_onerm(reps: usize) -> Option<f32> {
    if reps < 1 || reps > 12 {
        return None;
    }
    // Data pulled from https://www.bodybuilding.com/fun/other7.htm
    let thresholds = vec![
        100., 95., 93., 90., 87., 85., 83., 80., 77., 75., 73., 70.
    ];
    Some(thresholds[reps - 1])
}

#[test]
fn test_requirements() {
    assert_eq!(100., strength_required_for_100_onerm(1).unwrap());
    assert_eq!(83., strength_required_for_100_onerm(7).unwrap());
}

#[test]
fn test_find_onerm() {
    println!("{}", find_onerm(11, 200.));
}